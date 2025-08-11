import { sanityClient } from './sanityClient.ts';

async function debugBodyImages() {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "post" && slug.current == "come-pescare-il-pesce-serra-tecniche-attrezzatura-e-consigli-pratici"][0] {
        title,
        body
      }
    `);

    console.log('=== DEBUG BODY IMAGES ===');
    console.log('Titolo:', post.title);
    console.log('Body completo:', JSON.stringify(post.body, null, 2));
    
    // Cerca blocchi di tipo image nel body
    const imageBlocks = post.body.filter(block => block._type === 'image');
    console.log('Blocchi immagine trovati:', imageBlocks.length);
    
    imageBlocks.forEach((block, index) => {
      console.log(`\n--- Immagine ${index + 1} ---`);
      console.log('Tipo:', block._type);
      console.log('Asset:', block.asset);
      console.log('URL:', block.asset?.url);
      console.log('Alt:', block.alt);
      console.log('Caption:', block.caption);
    });

  } catch (error) {
    console.error('Errore:', error);
  }
}

debugBodyImages();
