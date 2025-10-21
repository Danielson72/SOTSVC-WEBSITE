import { County, ServiceArea } from './types';

export const counties: County[] = [
  {
    id: 'orange',
    name: 'Orange County',
    majorCities: ['Orlando', 'Winter Park', 'Ocoee', 'Winter Garden', 'Apopka'],
    popularServices: ['residential', 'commercial', 'deep-cleaning'],
  },
  {
    id: 'seminole',
    name: 'Seminole County',
    majorCities: ['Sanford', 'Altamonte Springs', 'Oviedo', 'Lake Mary', 'Casselberry'],
    popularServices: ['residential', 'move-in-out'],
  },
  {
    id: 'volusia',
    name: 'Volusia County',
    majorCities: ['Daytona Beach', 'DeLand', 'Ormond Beach', 'Port Orange'],
    popularServices: ['deep-cleaning', 'residential'],
  },
  {
    id: 'osceola',
    name: 'Osceola County',
    majorCities: ['Kissimmee', 'St. Cloud', 'Celebration', 'Poinciana'],
    popularServices: ['residential', 'commercial'],
  },
  {
    id: 'brevard',
    name: 'Brevard County',
    majorCities: ['Melbourne', 'Palm Bay', 'Cocoa Beach', 'Titusville'],
    popularServices: ['residential', 'deep-cleaning'],
  },
];

export const serviceAreas: ServiceArea[] = counties.map(county => ({
  county,
  isActive: true,
  coverage: 100,
}));