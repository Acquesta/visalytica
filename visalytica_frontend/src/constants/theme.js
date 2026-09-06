// Cores do sistema - Centralizadas para uso em toda a aplicação
//arquivo sugestão do gpt pois não da para usar o tailwind 
export const COLORS = {
  // Cores principais (já definidas no Tailwind)
  primary: '#166DED',        // azul
  primaryDark: '#2A279C',    // azul_escuro
  
  // Cores de texto
  textDark: '#333333',
  textMedium: '#666666',
  textLight: '#999999',
  
  // Cores de fundo e bordas
  background: '#ffffff',
  border: '#dddddd',
  borderLight: '#eeeeee',
  
  // Cores de estado
  success: '#16a34a',
  error: '#DD2020',         
  
  // Cores específicas para PDF
  pdf: {
    header: '#166DED',
    text: '#333333',
    subtext: '#666666',
    border: '#dddddd',
    background: '#ffffff',
  }
}

// Configurações de fonte para PDF
export const PDF_FONTS = {
  primary: 'Helvetica',
  sizes: {
    title: 16,
    subtitle: 14,
    sectionTitle: 12,
    text: 10,
    small: 8,
  }
}

// Configurações de layout para PDF
export const PDF_LAYOUT = {
  page: {
    padding: 40,
  },
  logo: {
    visalytica: { width: 170, height: 38 },
    dasa: { width: 32, height: 20 },
    visalyticaFooter: { width: 73, height: 19 },
    dasaFooter: { width: 25, height: 18 },
  },
  spacing: {
    section: 15,
    row: 6,
    small: 5,
  }
}
