import bcrypt from 'bcryptjs';
import { User, RegistrationData, FishingTechnique, FishingEnvironment, GearType, Season } from '../types/user';

// Funzione per validare email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Funzione per validare password
export function isValidPassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La password deve essere di almeno 8 caratteri');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La password deve contenere almeno una lettera maiuscola');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La password deve contenere almeno una lettera minuscola');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La password deve contenere almeno un numero');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Funzione per validare dati di registrazione
export function validateRegistrationData(data: RegistrationData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validazione email
  if (!data.email) {
    errors.push('Email richiesta');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email non valida');
  }
  
  // Validazione nome
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('Nome deve essere di almeno 2 caratteri');
  }
  
  // Validazione cognome
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push('Cognome deve essere di almeno 2 caratteri');
  }
  
  // Validazione password
  const passwordValidation = isValidPassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  
  // Validazione conferma password
  if (data.password !== data.confirmPassword) {
    errors.push('Le password non coincidono');
  }
  
  // Validazione esperienza
  if (!data.experience) {
    errors.push('Seleziona il tuo livello di esperienza');
  }
  
  // Validazione interessi minimi
  if (!data.interests.techniques || data.interests.techniques.length === 0) {
    errors.push('Seleziona almeno una tecnica di pesca');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Funzione per hashare password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Funzione per verificare password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Funzione per generare ID utente
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Funzione per creare utente con dati di default
export function createDefaultUser(registrationData: RegistrationData): Omit<User, 'id' | 'password'> {
  return {
    email: registrationData.email.toLowerCase().trim(),
    firstName: registrationData.firstName.trim(),
    lastName: registrationData.lastName.trim(),
    createdAt: new Date().toISOString(),
    isActive: true,
    experience: registrationData.experience,
    preferences: {
      newsletterFrequency: registrationData.preferences?.newsletterFrequency || 'weekly',
      preferredContent: registrationData.preferences?.preferredContent || 'all',
      language: registrationData.preferences?.language || 'it',
      timezone: registrationData.preferences?.timezone
    },
    interests: {
      techniques: registrationData.interests?.techniques || [],
      targetSpecies: registrationData.interests?.targetSpecies || [],
      environments: registrationData.interests?.environments || [],
      gearTypes: registrationData.interests?.gearTypes || [],
      seasons: registrationData.interests?.seasons || []
    },
    location: registrationData.location,
    notifications: {
      email: registrationData.notifications?.email ?? true,
      push: registrationData.notifications?.push ?? false,
      weeklyDigest: registrationData.notifications?.weeklyDigest ?? true,
      newArticles: registrationData.notifications?.newArticles ?? true,
      seasonalTips: registrationData.notifications?.seasonalTips ?? true,
      gearDeals: registrationData.notifications?.gearDeals ?? false
    }
  };
}

// Funzione per ottenere opzioni di targeting
export function getTargetingOptions() {
  return {
    techniques: Object.values(FishingTechnique).map(technique => ({
      value: technique,
      label: getTechniqueLabel(technique)
    })),
    environments: Object.values(FishingEnvironment).map(environment => ({
      value: environment,
      label: getEnvironmentLabel(environment)
    })),
    gearTypes: Object.values(GearType).map(gear => ({
      value: gear,
      label: getGearLabel(gear)
    })),
    seasons: Object.values(Season).map(season => ({
      value: season,
      label: getSeasonLabel(season)
    })),
    experienceLevels: [
      { value: 'beginner', label: 'Principiante' },
      { value: 'intermediate', label: 'Intermedio' },
      { value: 'advanced', label: 'Avanzato' },
      { value: 'expert', label: 'Esperto' }
    ]
  };
}

// Funzioni helper per le label
function getTechniqueLabel(technique: FishingTechnique): string {
  const labels: Record<FishingTechnique, string> = {
    [FishingTechnique.SPINNING]: 'Spinning',
    [FishingTechnique.FLY_FISHING]: 'Pesca a Mosca',
    [FishingTechnique.CARP_FISHING]: 'Pesca alla Carpa',
    [FishingTechnique.BASS_FISHING]: 'Pesca al Bass',
    [FishingTechnique.PIKE_FISHING]: 'Pesca al Luccio',
    [FishingTechnique.TROUT_FISHING]: 'Pesca alla Trota',
    [FishingTechnique.SEA_FISHING]: 'Pesca in Mare',
    [FishingTechnique.LAKE_FISHING]: 'Pesca al Lago',
    [FishingTechnique.RIVER_FISHING]: 'Pesca al Fiume',
    [FishingTechnique.ICE_FISHING]: 'Pesca sul Ghiaccio',
    [FishingTechnique.SURF_FISHING]: 'Pesca dalla Spiaggia',
    [FishingTechnique.BOAT_FISHING]: 'Pesca dalla Barca'
  };
  return labels[technique];
}

function getEnvironmentLabel(environment: FishingEnvironment): string {
  const labels: Record<FishingEnvironment, string> = {
    [FishingEnvironment.RIVERS]: 'Fiumi',
    [FishingEnvironment.LAKES]: 'Laghi',
    [FishingEnvironment.SEA]: 'Mare',
    [FishingEnvironment.PONDS]: 'Stagni',
    [FishingEnvironment.STREAMS]: 'Torrenti',
    [FishingEnvironment.RESERVOIRS]: 'Bacini',
    [FishingEnvironment.COASTAL]: 'Costa',
    [FishingEnvironment.DEEP_SEA]: 'Alto Mare'
  };
  return labels[environment];
}

function getGearLabel(gear: GearType): string {
  const labels: Record<GearType, string> = {
    [GearType.RODS]: 'Canne',
    [GearType.REELS]: 'Mulinelli',
    [GearType.LURES]: 'Esche Artificiali',
    [GearType.BAITS]: 'Esche Naturali',
    [GearType.LINES]: 'Fili',
    [GearType.HOOKS]: 'Ami',
    [GearType.SINKERS]: 'Piombi',
    [GearType.FLOATS]: 'Galleggianti',
    [GearType.NETS]: 'Reti',
    [GearType.WADERS]: 'Stivali da Pesca',
    [GearType.BOOTS]: 'Scarponi',
    [GearType.CLOTHING]: 'Abbigliamento',
    [GearType.ACCESSORIES]: 'Accessori'
  };
  return labels[gear];
}

function getSeasonLabel(season: Season): string {
  const labels: Record<Season, string> = {
    [Season.SPRING]: 'Primavera',
    [Season.SUMMER]: 'Estate',
    [Season.AUTUMN]: 'Autunno',
    [Season.WINTER]: 'Inverno'
  };
  return labels[season];
}

// Funzione per calcolare match tra utente e contenuto
export function calculateContentMatch(user: User, contentTags: string[]): number {
  let matchScore = 0;
  const totalPossible = contentTags.length;
  
  // Controlla tecniche
  const userTechniques = user.interests.techniques.map(t => t.toLowerCase());
  const matchingTechniques = contentTags.filter(tag => 
    userTechniques.some(tech => tag.toLowerCase().includes(tech))
  );
  matchScore += matchingTechniques.length;
  
  // Controlla ambienti
  const userEnvironments = user.interests.environments.map(e => e.toLowerCase());
  const matchingEnvironments = contentTags.filter(tag => 
    userEnvironments.some(env => tag.toLowerCase().includes(env))
  );
  matchScore += matchingEnvironments.length;
  
  // Controlla attrezzatura
  const userGear = user.interests.gearTypes.map(g => g.toLowerCase());
  const matchingGear = contentTags.filter(tag => 
    userGear.some(gear => tag.toLowerCase().includes(gear))
  );
  matchScore += matchingGear.length;
  
  return totalPossible > 0 ? (matchScore / totalPossible) * 100 : 0;
}
