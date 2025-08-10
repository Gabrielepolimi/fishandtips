import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      experience: string;
      preferences: {
        newsletterFrequency: string;
        preferredContent: string;
        language: string;
        timezone?: string;
      } | null;
      interests: {
        techniques: string;
        targetSpecies: string;
        environments: string;
        gearTypes: string;
        seasons: string;
      } | null;
      location: {
        region: string;
        province: string;
        city: string;
        latitude?: number;
        longitude?: number;
      } | null;
      notifications: {
        email: boolean;
        push: boolean;
        weeklyDigest: boolean;
        newArticles: boolean;
        seasonalTips: boolean;
        gearDeals: boolean;
      } | null;
      createdAt: string | Date;
      lastLogin: string | Date;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    experience: string;
    preferences: {
      newsletterFrequency: string;
      preferredContent: string;
      language: string;
      timezone?: string;
    } | null;
    interests: {
      techniques: string;
      targetSpecies: string;
      environments: string;
      gearTypes: string;
      seasons: string;
    } | null;
    location: {
      region: string;
      province: string;
      city: string;
      latitude?: number;
      longitude?: number;
    } | null;
    notifications: {
      email: boolean;
      push: boolean;
      weeklyDigest: boolean;
      newArticles: boolean;
      seasonalTips: boolean;
      gearDeals: boolean;
    } | null;
    createdAt: string | Date;
    lastLogin: string | Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    experience: string;
    preferences: {
      newsletterFrequency: string;
      preferredContent: string;
      language: string;
      timezone?: string;
    } | null;
    interests: {
      techniques: string;
      targetSpecies: string;
      environments: string;
      gearTypes: string;
      seasons: string;
    } | null;
    location: {
      region: string;
      province: string;
      city: string;
      latitude?: number;
      longitude?: number;
    } | null;
    notifications: {
      email: boolean;
      push: boolean;
      weeklyDigest: boolean;
      newArticles: boolean;
      seasonalTips: boolean;
      gearDeals: boolean;
    } | null;
    createdAt: string | Date;
    lastLogin: string | Date;
  }
}
