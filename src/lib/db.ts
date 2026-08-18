import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { DatabaseSchema, User, BreederProfile, Listing, Favorite, Conversation, Message, Review, Report, AnimalType, Breed, Notification, SubscriptionPlan, Payment } from "@/types";

const dbPath = path.join(process.cwd(), "src", "data", "db.json");
const adapter = new JSONFile<DatabaseSchema>(dbPath);

const defaultData: DatabaseSchema = {
  users: [],
  breederProfiles: [],
  listings: [],
  favorites: [],
  conversations: [],
  messages: [],
  reviews: [],
  reports: [],
  animalTypes: [
    { id: "dogs", name: "Dogs", icon: "dog", sortOrder: 1 },
    { id: "cats", name: "Cats", icon: "cat", sortOrder: 2 },
    { id: "rabbits", name: "Rabbits", icon: "rabbit", sortOrder: 3 },
    { id: "birds", name: "Birds", icon: "bird", sortOrder: 4 },
    { id: "other", name: "Other", icon: "other", sortOrder: 5 },
  ],
  breeds: [
    { id: "b1", animalTypeId: "dogs", name: "Golden Retriever" },
    { id: "b2", animalTypeId: "dogs", name: "German Shepherd" },
    { id: "b3", animalTypeId: "dogs", name: "French Bulldog" },
    { id: "b4", animalTypeId: "dogs", name: "Labrador Retriever" },
    { id: "b5", animalTypeId: "dogs", name: "Beagle" },
    { id: "b6", animalTypeId: "dogs", name: "Poodle" },
    { id: "b7", animalTypeId: "dogs", name: "Bulldog" },
    { id: "b8", animalTypeId: "dogs", name: "Rottweiler" },
    { id: "b9", animalTypeId: "dogs", name: "Yorkshire Terrier" },
    { id: "b10", animalTypeId: "dogs", name: "Boxer" },
    { id: "b11", animalTypeId: "dogs", name: "Dachshund" },
    { id: "b12", animalTypeId: "dogs", name: "Siberian Husky" },
    { id: "b13", animalTypeId: "cats", name: "Maine Coon" },
    { id: "b14", animalTypeId: "cats", name: "British Shorthair" },
    { id: "b15", animalTypeId: "cats", name: "Bengal" },
    { id: "b16", animalTypeId: "cats", name: "Siamese" },
    { id: "b17", animalTypeId: "cats", name: "Persian" },
    { id: "b18", animalTypeId: "cats", name: "Ragdoll" },
    { id: "b19", animalTypeId: "cats", name: "Sphynx" },
    { id: "b20", animalTypeId: "cats", name: "Scottish Fold" },
    { id: "b21", animalTypeId: "cats", name: "Norwegian Forest" },
    { id: "b22", animalTypeId: "cats", name: "Russian Blue" },
    { id: "b23", animalTypeId: "rabbits", name: "Holland Lop" },
    { id: "b24", animalTypeId: "rabbits", name: "Mini Rex" },
    { id: "b25", animalTypeId: "rabbits", name: "Lionhead" },
    { id: "b26", animalTypeId: "rabbits", name: "Netherland Dwarf" },
    { id: "b27", animalTypeId: "rabbits", name: "Flemish Giant" },
    { id: "b28", animalTypeId: "rabbits", name: "English Angora" },
    { id: "b29", animalTypeId: "birds", name: "African Grey Parrot" },
    { id: "b30", animalTypeId: "birds", name: "Budgerigar" },
    { id: "b31", animalTypeId: "birds", name: "Cockatiel" },
    { id: "b32", animalTypeId: "birds", name: "Macaw" },
    { id: "b33", animalTypeId: "birds", name: "Lovebird" },
    { id: "b34", animalTypeId: "birds", name: "Canary" },
    { id: "b35", animalTypeId: "birds", name: "Eclectus Parrot" },
    { id: "b36", animalTypeId: "other", name: "Hamster" },
    { id: "b37", animalTypeId: "other", name: "Guinea Pig" },
    { id: "b38", animalTypeId: "other", name: "Ferret" },
    { id: "b39", animalTypeId: "other", name: "Chinchilla" },
    { id: "b40", animalTypeId: "other", name: "Tortoise" },
  ],
  notifications: [],
  subscriptionPlans: [
    { id: "free", name: "Free", price: 0, interval: "month", features: ["Standard listings", "Normal search placement", "Basic profile"], sortOrder: 1 },
    { id: "breeder", name: "Breeder", price: 9.99, interval: "month", features: ["Up to 10 active listings", "Priority search placement", "Verified badge eligibility", "Analytics dashboard"], sortOrder: 2 },
    { id: "pro", name: "Professional", price: 24.99, interval: "month", features: ["Unlimited listings", "Top search placement", "Featured listings", "Premium analytics", "Priority support"], sortOrder: 3 },
  ],
  payments: [],
};

let dbInstance: Low<DatabaseSchema> | null = null;

export async function getDb(): Promise<Low<DatabaseSchema>> {
  if (!dbInstance) {
    dbInstance = new Low<DatabaseSchema>(adapter, defaultData);
    await dbInstance.read();
    if (!dbInstance.data) {
      dbInstance.data = defaultData;
      await dbInstance.write();
    }
  }
  return dbInstance;
}

export async function seedDemoData() {
  const db = await getDb();
  if (db.data.users.length > 0) return;

  const now = new Date().toISOString();

  const adminUser: User = {
    id: uuidv4(),
    email: "admin@breedela.demo",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    isSuspended: false,
  };

  const breederUser1: User = {
    id: uuidv4(),
    email: "breeder1@breedela.demo",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    firstName: "Maria",
    lastName: "Schneider",
    role: "breeder",
    phone: "+49 89 12345678",
    createdAt: now,
    updatedAt: now,
    isSuspended: false,
  };

  const breederUser2: User = {
    id: uuidv4(),
    email: "breeder2@breedela.demo",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    firstName: "Jan",
    lastName: "Van Dijk",
    role: "breeder",
    phone: "+31 20 87654321",
    createdAt: now,
    updatedAt: now,
    isSuspended: false,
  };

  const buyerUser: User = {
    id: uuidv4(),
    email: "buyer@breedela.demo",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    firstName: "Emma",
    lastName: "Johnson",
    role: "buyer",
    createdAt: now,
    updatedAt: now,
    isSuspended: false,
  };

  db.data.users.push(adminUser, breederUser1, breederUser2, buyerUser);

  const breeder1: BreederProfile = {
    id: uuidv4(),
    userId: breederUser1.id,
    kennelName: "Greenfield Retrievers",
    location: "Munich, Germany",
    about: "Family-run kennel specializing in healthy, well-socialized retrievers with full pedigree documentation.",
    experienceYears: 8,
    breeds: ["Golden Retriever", "Labrador Retriever"],
    verified: true,
    verificationRequested: false,
    totalListings: 2,
    createdAt: now,
    updatedAt: now,
  };

  const breeder2: BreederProfile = {
    id: uuidv4(),
    userId: breederUser2.id,
    kennelName: "Royal Maine Coons",
    location: "Amsterdam, Netherlands",
    about: "Champion bloodline Maine Coons raised in a home environment with full health testing.",
    experienceYears: 12,
    breeds: ["Maine Coon", "British Shorthair"],
    verified: true,
    verificationRequested: false,
    totalListings: 2,
    createdAt: now,
    updatedAt: now,
  };

  db.data.breederProfiles.push(breeder1, breeder2);

  const listings: Listing[] = [
    {
      id: uuidv4(),
      breederId: breeder1.id,
      breederName: breeder1.kennelName,
      breederVerified: true,
      title: "Max - Golden Retriever Puppy",
      animalType: "dogs",
      breed: "Golden Retriever",
      gender: "Male",
      dateOfBirth: "2026-04-15",
      price: 1800,
      location: "Munich, Germany",
      description: "Beautiful golden retriever puppy with champion bloodlines. Very playful and well-socialized. Parents are both health-tested and have excellent temperaments.",
      photos: ["https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      healthInfo: "Hip and elbow scores: Both parents HD-A, ED-0. Regular vet checks completed.",
      parentsInfo: "Sire: CH Greenfield's Golden Boy (HD-A, ED-0). Dam: Greenfield's Sunshine (HD-A, ED-0).",
      status: "approved",
      isBoosted: false,
      isPremium: true,
      viewCount: 245,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      breederId: breeder1.id,
      breederName: breeder1.kennelName,
      breederVerified: true,
      title: "Charlie - Labrador Retriever",
      animalType: "dogs",
      breed: "Labrador Retriever",
      gender: "Male",
      dateOfBirth: "2026-04-01",
      price: 1500,
      location: "Munich, Germany",
      description: "Chocolate Labrador with excellent retrieving instinct. Great for active families. Well-socialized with children and other dogs.",
      photos: ["https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      healthInfo: "All vaccinations up to date. Vet checked and cleared.",
      parentsInfo: "Both parents are working gundogs with excellent pedigrees.",
      status: "approved",
      isBoosted: true,
      isPremium: false,
      viewCount: 189,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      breederId: breeder2.id,
      breederName: breeder2.kennelName,
      breederVerified: true,
      title: "Luna - Silver Tabby Maine Coon",
      animalType: "cats",
      breed: "Maine Coon",
      gender: "Female",
      dateOfBirth: "2026-03-20",
      price: 1200,
      location: "Amsterdam, Netherlands",
      description: "Stunning silver tabby Maine Coon with excellent bone structure and friendly personality. Raised in our home with children.",
      photos: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      healthInfo: "HCM and SMA negative. Regular vet checks. Dewormed and vaccinated.",
      parentsInfo: "Sire: CH Royal Nordic Thunder. Dam: Royal Bella.",
      status: "approved",
      isBoosted: true,
      isPremium: false,
      viewCount: 312,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      breederId: breeder2.id,
      breederName: breeder2.kennelName,
      breederVerified: true,
      title: "Nala - British Shorthair",
      animalType: "cats",
      breed: "British Shorthair",
      gender: "Female",
      dateOfBirth: "2026-01-15",
      price: 950,
      location: "Amsterdam, Netherlands",
      description: "Blue British Shorthair with dense coat and round face. Calm and affectionate temperament. Perfect indoor companion.",
      photos: ["https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      healthInfo: "PKD negative. Full vaccination course completed.",
      parentsInfo: "Imported lines from UK and Germany.",
      status: "approved",
      isBoosted: false,
      isPremium: false,
      viewCount: 156,
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.data.listings.push(...listings);
  await db.write();
}

export function generateId(): string {
  return uuidv4();
}