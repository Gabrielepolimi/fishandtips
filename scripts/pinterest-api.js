import 'dotenv/config';
// Node 18+ ha fetch nativo, non serve node-fetch

// ============================================
// PINTEREST API SERVICE
// Gestisce le chiamate all'API Pinterest v5
// ============================================

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';

/**
 * Ottiene le bacheche dell'utente
 */
export async function getBoards(accessToken) {
  console.log('\n📋 Recupero bacheche Pinterest...');

  const response = await fetch(`${PINTEREST_API_BASE}/boards`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinterest API Error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  console.log(`   ✅ Trovate ${data.items?.length || 0} bacheche`);
  
  return data.items || [];
}

/**
 * Crea una nuova bacheca
 */
export async function createBoard(accessToken, name, description = '') {
  console.log(`\n📋 Creazione bacheca: ${name}`);

  const response = await fetch(`${PINTEREST_API_BASE}/boards`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description,
      privacy: 'PUBLIC'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinterest API Error: ${JSON.stringify(error)}`);
  }

  const board = await response.json();
  console.log(`   ✅ Bacheca creata: ${board.id}`);
  
  return board;
}

/**
 * Trova una bacheca esistente per nome (NO creazione - serve permesso boards:write)
 */
export async function findOrCreateBoard(accessToken, boardName, description = '') {
  const boards = await getBoards(accessToken);
  
  // Cerca bacheca esistente (case-insensitive)
  const existingBoard = boards.find(b => 
    b.name.toLowerCase() === boardName.toLowerCase()
  );
  
  if (existingBoard) {
    console.log(`   📋 Bacheca trovata: ${existingBoard.name} (${existingBoard.id})`);
    return existingBoard;
  }
  
  // Se non trovata, cerca bacheca simile
  const similarBoard = boards.find(b => 
    b.name.toLowerCase().includes('pesca') || 
    boardName.toLowerCase().includes(b.name.toLowerCase().split(' ')[0])
  );
  
  if (similarBoard) {
    console.log(`   📋 Usando bacheca simile: ${similarBoard.name} (${similarBoard.id})`);
    return similarBoard;
  }
  
  // Fallback: usa la prima bacheca disponibile
  if (boards.length > 0) {
    console.log(`   ⚠️ Bacheca "${boardName}" non trovata, uso: ${boards[0].name}`);
    return boards[0];
  }
  
  throw new Error(`Nessuna bacheca trovata! Crea almeno una bacheca su Pinterest.`);
}

/**
 * Pubblica un pin
 */
export async function createPin(accessToken, pinData) {
  console.log('\n📌 Pubblicazione pin...');
  console.log(`   📋 Bacheca: ${pinData.boardId}`);
  console.log(`   🔗 Link: ${pinData.link}`);

  const payload = {
    board_id: pinData.boardId,
    title: pinData.title,
    description: pinData.description,
    link: pinData.link,
    alt_text: pinData.altText || pinData.title
  };

  // Pinterest richiede che l'immagine sia già hostata su un URL pubblico
  if (pinData.imageUrl) {
    payload.media_source = {
      source_type: 'image_url',
      url: pinData.imageUrl
    };
  }

  const response = await fetch(`${PINTEREST_API_BASE}/pins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Errore Pinterest:', error);
    throw new Error(`Pinterest API Error: ${JSON.stringify(error)}`);
  }

  const pin = await response.json();
  console.log(`   ✅ Pin pubblicato: ${pin.id}`);
  
  return pin;
}

/**
 * Ottiene info sull'utente autenticato
 */
export async function getUserInfo(accessToken) {
  console.log('\n👤 Recupero info utente...');

  const response = await fetch(`${PINTEREST_API_BASE}/user_account`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pinterest API Error: ${JSON.stringify(error)}`);
  }

  const user = await response.json();
  console.log(`   ✅ Utente: ${user.username}`);
  
  return user;
}

/**
 * Verifica se il token è valido
 */
export async function verifyToken(accessToken) {
  try {
    await getUserInfo(accessToken);
    return true;
  } catch (error) {
    console.error('❌ Token non valido:', error.message);
    return false;
  }
}

/**
 * Flusso completo: pubblica pin su bacheca specifica
 */
export async function publishPinToBoard(accessToken, boardName, pinContent, imageUrl) {
  // Trova o crea la bacheca
  const board = await findOrCreateBoard(
    accessToken, 
    boardName, 
    `Contenuti di pesca da FishandTips.it - ${boardName}`
  );

  // Crea il pin
  const pin = await createPin(accessToken, {
    boardId: board.id,
    title: pinContent.title,
    description: pinContent.description,
    link: pinContent.link,
    altText: pinContent.altText,
    imageUrl: imageUrl
  });

  return {
    pin,
    board
  };
}

// Test
if (import.meta.url === `file://${process.argv[1]}`) {
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('❌ PINTEREST_ACCESS_TOKEN non configurato!');
    process.exit(1);
  }

  verifyToken(accessToken)
    .then(valid => {
      if (valid) {
        console.log('✅ Token valido!');
        return getBoards(accessToken);
      }
    })
    .then(boards => {
      if (boards) {
        console.log('\n📋 Bacheche:');
        boards.forEach(b => console.log(`   - ${b.name} (${b.id})`));
      }
    })
    .catch(console.error);
}

