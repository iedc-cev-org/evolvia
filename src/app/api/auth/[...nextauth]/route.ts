import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth env vars: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;
      
      console.log('Google sign-in attempt:', { 
        email: user.email, 
        name: user.name,
        hasImage: !!user.image 
      });
      
      try {
        // Ensure we have MongoDB connection
        if (!process.env.MONGODB_URI) {
          console.error('MONGODB_URI not configured');
          return false;
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');
        
        console.log('Connected to MongoDB, checking for existing user...');
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: user.email });
        
        if (!existingUser) {
          console.log('Creating new user in database...');
          // Create new user with Google auth data
          const newUser = {
            email: user.email,
            name: user.name,
            image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`,
            score: 0,
            provider: 'google',
            googleId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const result = await usersCollection.insertOne(newUser);
          console.log('New user created with ID:', result.insertedId);
        } else {
          console.log('Updating existing user...');
          // Update existing user's info (in case profile changed)
          await usersCollection.updateOne(
            { email: user.email },
            { 
              $set: { 
                name: user.name,
                image: user.image || existingUser.image,
                googleId: user.id,
                updatedAt: new Date()
              }
            }
          );
          console.log('User updated successfully');
        }
        
        return true;
      } catch (error) {
        console.error('Error saving user to database:', error);
        // Don't block sign-in if database fails, but log the error
        return true; // Still allow sign-in even if database save fails
      }
    },
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
  },
});

export { handler as GET, handler as POST };
