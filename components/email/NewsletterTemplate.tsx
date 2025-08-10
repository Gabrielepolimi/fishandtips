import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Img,
  Hr,
  Button,
  Row,
  Column,
  Preview,
} from '@react-email/components';
import { ScoredArticle } from '../../lib/utils/targeting';

interface NewsletterTemplateProps {
  userName: string;
  userFirstName: string;
  articles: ScoredArticle[];
  userPreferences: {
    totalInterests: number;
  };
  unsubscribeUrl: string;
  preferencesUrl: string;
}

export default function NewsletterTemplate({
  userName,
  userFirstName,
  articles,
  userPreferences,
  unsubscribeUrl,
  preferencesUrl,
}: NewsletterTemplateProps) {


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Html>
      <Head>
        <title>FishandTips - Newsletter Personalizzata</title>
        <meta name="description" content="Le migliori notizie di pesca selezionate per te" />
      </Head>
      <Preview>
        🎣 {userFirstName}, ecco i migliori articoli di pesca selezionati per te!
      </Preview>
      
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Heading style={logo}>🎣 FishandTips</Heading>
                <Text style={tagline}>La tua passione per la pesca, personalizzata</Text>
              </Column>
            </Row>
          </Section>

          {/* Greeting */}
          <Section style={greeting}>
            <Heading style={h1}>
              Ciao {userFirstName}! 👋
            </Heading>
            <Text style={text}>
              Ecco i migliori articoli di pesca selezionati apposta per te, 
              basati sulle tue preferenze e sul tuo livello di esperienza.
            </Text>
          </Section>

          {/* User Stats */}
          <Section style={statsContainer}>
            <Row>
              <Column style={statItem}>
                <Text style={statNumber}>{userPreferences.totalInterests}</Text>
                <Text style={statLabel}>Tecniche Preferite</Text>
              </Column>
            </Row>
          </Section>

          {/* Articles */}
          <Section style={articlesSection}>
            <Heading style={h2}>📝 Articoli per Te</Heading>
            
            {articles.map((article, index) => (
              <Section key={article._id} style={articleContainer}>
                <Row>
                  <Column style={articleImageColumn}>
                    {article.mainImage && (
                      <Img
                        src={article.mainImage}
                        alt={article.title}
                        style={articleImage}
                      />
                    )}
                  </Column>
                  <Column style={articleContentColumn}>
                    <Heading style={articleTitle}>{article.title}</Heading>
                    <Text style={articleExcerpt}>{article.excerpt}</Text>
                    
                    <Row style={articleMeta}>
                      <Column>
                        <Text style={articleAuthor}>di {article.author}</Text>
                      </Column>
                      <Column>
                        <Text style={articleDate}>{formatDate(article.publishedAt)}</Text>
                      </Column>
                    </Row>

                    <Row style={articleTags}>
                      <Column>
                        <Text style={matchScore}>
                          Match: {article.score}%
                        </Text>
                      </Column>
                    </Row>

                    {article.fishingTechniques && article.fishingTechniques.length > 0 && (
                      <Row style={techniquesRow}>
                        <Column>
                          <Text style={techniquesLabel}>
                            🎣 Tecniche: {article.fishingTechniques.slice(0, 2).map(t => t.title).join(', ')}
                            {article.fishingTechniques.length > 2 && '...'}
                          </Text>
                        </Column>
                      </Row>
                    )}

                    <Button style={readButton} href={`https://fishandtips.it/articoli/${article.slug}`}>
                      Leggi Articolo →
                    </Button>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          {/* Call to Action */}
          <Section style={ctaSection}>
            <Heading style={h2}>🎯 Vuoi più contenuti personalizzati?</Heading>
            <Text style={text}>
              Aggiorna le tue preferenze per ricevere articoli ancora più mirati alle tue esigenze.
            </Text>
            <Button style={ctaButton} href={preferencesUrl}>
              Modifica Preferenze
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Ricevi questa email perché ti sei iscritto alla newsletter di FishandTips.
            </Text>
            <Row style={footerLinks}>
              <Column>
                <Link style={footerLink} href={preferencesUrl}>
                  Modifica Preferenze
                </Link>
              </Column>
              <Column>
                <Link style={footerLink} href={unsubscribeUrl}>
                  Disiscriviti
                </Link>
              </Column>
            </Row>
            <Text style={footerText}>
              © 2024 FishandTips. Tutti i diritti riservati.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#1f2937',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const tagline = {
  color: '#9ca3af',
  fontSize: '16px',
  margin: '0',
};

const greeting = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  borderBottom: '1px solid #e5e7eb',
};

const h1 = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const h2 = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const statsContainer = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderBottom: '1px solid #e5e7eb',
};

const statItem = {
  textAlign: 'center' as const,
  padding: '0 16px',
};

const statNumber = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const statLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const articlesSection = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
};

const articleContainer = {
  marginBottom: '32px',
  padding: '24px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
};

const articleImageColumn = {
  width: '120px',
  paddingRight: '16px',
};

const articleContentColumn = {
  width: '100%',
};

const articleImage = {
  width: '100%',
  height: '80px',
  objectFit: 'cover' as const,
  borderRadius: '4px',
};

const articleTitle = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  lineHeight: '24px',
};

const articleExcerpt = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px 0',
};

const articleMeta = {
  marginBottom: '8px',
};

const articleAuthor = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
};

const articleDate = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
  textAlign: 'right' as const,
};

const articleTags = {
  marginBottom: '12px',
};



const matchScore = {
  color: '#059669',
  fontSize: '11px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  margin: '0',
};

const techniquesRow = {
  marginBottom: '16px',
};

const techniquesLabel = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '0',
};

const readButton = {
  backgroundColor: '#1f2937',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
};

const ctaSection = {
  backgroundColor: '#ffffff',
  padding: '32px 24px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
};

const ctaButton = {
  backgroundColor: '#059669',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  backgroundColor: '#ffffff',
  padding: '24px',
  textAlign: 'center' as const,
  borderRadius: '0 0 8px 8px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 16px 0',
};

const footerLinks = {
  marginBottom: '16px',
};

const footerLink = {
  color: '#1f2937',
  fontSize: '14px',
  textDecoration: 'underline',
  margin: '0 16px',
};
