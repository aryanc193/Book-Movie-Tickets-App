import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.daddycoders.book_mov_tickets",
  projectId: "669b5852000b54b34658",
  storageId: "669b5a32000ee4c6b23f",
  databaseId: "669b59ff0030440048c9",
  userCollectionId: "669b5a040031c0fc7789",
  moviesCollectionId: "669f5bcb0031b3779042",
  bookingCollectionId: "669f5bd3001098bfa4b0",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.moviesCollectionId,
      [Query.orderAsc("$createdAt")]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserCity = async (userId, city) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { city }
    );
  } catch (error) {
    console.error("Failed to update city:", error);
  }
};

export const getMovieById = async (id) => {
  try {
    // console.log("Fetching service center with ID:", id); // Log the ID
    const movie = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.moviesCollectionId,
      id
    );
    return movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw new Error(error.message);
  }
};

export const bookAppointment = async (
  userId,
  movieTitle,
  theater,
  date,
  time,
  seats,
  city,
  img
) => {
  try {
    const ticketData = {
      creator: userId,
      movie: movieTitle,
      theater: theater,
      date: date,
      time: time,
      seats: seats,
      city: city,
      img: img,
    };

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      ID.unique(),
      ticketData
    );

    return response;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error(error.message);
  }
};

export const getTickets = async (userId) => {
  try {
    // Fetch bookings for the user
    const bookingsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      [Query.equal("creator", userId)]
    );
    const bookings = bookingsResponse.documents;

    // Extract movie details for each booking
    const ticketsPromises = bookings.map(async (booking) => {
      return {
        creator: booking.creator,
        movie: booking.movie,
        theater: booking.theater,
        date: booking.date,
        time: booking.time,
        seats: booking.seats,
        city: booking.city,
        img: booking.img,
      };
    });

    // Fetch movie details in parallel
    const tickets = await Promise.all(ticketsPromises);

    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error(error.message);
  }
};
