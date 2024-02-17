const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Näidis array mängijate andmete hoidmiseks
let players = [];

// Route loomise vormi renderdamiseks
app.get('/create', (req, res) => {
  res.send(`
    <h1>Loo Mängija</h1>
    <form action="/players" method="post">
      <label for="playerName">Mängija Nimi:</label>
      <input type="text" id="playerName" name="playerName" required>
      <button type="submit">Loo Mängija</button>
    </form>
  `);
});

// Route uue mängija loomiseks
app.post('/players', (req, res) => {
  const playerName = req.body.playerName;
  players.push(playerName);
  console.log('Uus mängija loodud:', playerName);
  res.redirect('/'); // Redirect root-URLile pärast mängija loomist
});

// Route olemasolevate mängijate loetlemiseks koos uuendamise ja kustutamise valikutega
app.get('/', (req, res) => {
  let playerList = '<h1>Mängijad</h1><ul>';
  players.forEach(player => {
    // Lisa iga mängija jaoks uuendamise ja kustutamise valikud
    playerList += `
      <li>${player} 
        <form action="/players/delete" method="post">
          <input type="hidden" name="playerName" value="${player}">
          <button type="submit">Kustuta</button>
        </form>
        <a href="/players/update/${player}">Uuenda</a>
      </li>`;
  });
  playerList += '</ul>';
  res.send(playerList);
});

// Route mängija uuendamise vormi renderdamiseks
app.get('/players/update/:playerName', (req, res) => {
  const playerNameToUpdate = req.params.playerName;
  res.send(`
    <h1>Uuenda Mängijat</h1>
    <form action="/players/update/${playerNameToUpdate}" method="post">
      <label for="newPlayerName">Uus Mängija Nimi:</label>
      <input type="text" id="newPlayerName" name="newPlayerName" value="${playerNameToUpdate}" required>
      <button type="submit">Uuenda Mängija</button>
    </form>
  `);
});

// Route mängija uuendamiseks
app.post('/players/update/:playerName', (req, res) => {
  const playerNameToUpdate = req.params.playerName;
  const newPlayerName = req.body.newPlayerName;
  // Uuenda mängija nimi mängijate array's
  players = players.map(player => player === playerNameToUpdate ? newPlayerName : player);
  console.log('Mängija uuendatud:', playerNameToUpdate, 'uueks nimeks', newPlayerName);
  res.redirect('/');
});

// Route mängija kustutamiseks
app.post('/players/delete', (req, res) => {
  const playerNameToDelete = req.body.playerName;
  players = players.filter(player => player !== playerNameToDelete);
  console.log('Mängija kustutatud:', playerNameToDelete);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server töötab aadressil http://localhost:${PORT}`);
});
