export interface Faculty {
  name: string;
  departments: string[];
}

export const ACADEMIC_DATA: Faculty[] = [
  {
    name: 'Agriculture',
    departments: [
      'Agricultural Economics and Extension',
      'Animal Science and Production',
      'Crop Science and Production',
      'Fisheries and Aquaculture',
      'Soil Science and Land Management'
    ]
  },
  {
    name: 'Arts',
    departments: [
      'English and Literary Studies',
      'History and Diplomatic Studies',
      'Philosophy',
      'Religious Studies',
      'Theatre Arts'
    ]
  },
  {
    name: 'Computing',
    departments: [
      'Computer Science',
      'Cyber Security',
      'Data Science',
      'Information Systems',
      'Software Engineering'
    ]
  },
  {
    name: 'Environmental Sciences',
    departments: [
      'Architecture',
      'Building',
      'Environmental Management and Toxicology',
      'Estate Management',
      'Fine and Applied Arts',
      'Quantity Surveying',
      'Surveying and Geo-informatics',
      'Urban and Regional Planning'
    ]
  },
  {
    name: 'Management and Social Sciences',
    departments: [
      'Accounting',
      'Banking and Finance',
      'Business Administration',
      'Criminology and Security Studies',
      'Economics',
      'Entrepreneurship',
      'Hospitality and Tourism Management',
      'Industrial Relations and Personnel Management',
      'Mass Communication',
      'Political Science',
      'Psychology',
      'Public Administration',
      'Sociology'
    ]
  },
  {
    name: 'Sciences',
    departments: [
      'Animal and Environmental Biology',
      'Applied Geophysics',
      'Biochemistry and Molecular Biology',
      'Biology',
      'Biotechnology',
      'Chemistry',
      'Geology',
      'Industrial Chemistry',
      'Mathematics',
      'Microbiology',
      'Physics',
      'Plant Science and Biotechnology',
      'Statistics'
    ]
  },
  {
    name: 'Law',
    departments: [
      'Public Law',
      'Private and Property Law',
      'Commercial and Industrial Law',
      'Jurisprudence and International Law'
    ]
  },
  {
    name: 'Allied Health Sciences',
    departments: [
      'Medical Laboratory Science',
      'Nursing Science',
      'Public Health'
    ]
  }
];
