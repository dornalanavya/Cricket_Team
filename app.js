const express = require("express");
const path = require("path")

const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
    try{
        db = await open({
            filename: dbpath,
            driver: sqlite3.Database,

        });
        app.listen(3002, () => {
            console.log("Server Running at http://localhost:3002/");

        })
     } catch(e) {
            console.log(`DB Error: ${e.message}`);
            process.exit(1);
        }
    };
    initializeDBAndServer();
    const convertDbObjectToResponseObject = (dbObject) => {
        return {
            playerId: dbObject.player_Id,
            playerName: dbObject.player_name,
            jerseyNumber: dbObject.jersey_number,
            role: dbObject.role,
        };
    };
    // returns a list of all players in the team
    app.get("/players/", async (request, response) => {
          const getCricketQuery = `
        SELECT 
        *
        FROM 
        cricket_team;`;
          const cricketArray = await db.all(getCricketQuery);
          response.send(
              cricketArray.map((eachPlayer) => 
              convertDbObjectToResponseObject(eachPlayer) 
              )
          );
    });
    //creates a new player in the team (database). player_id is auto-incremented
    app.post("/players/",async (request, response) => {
        const playerDetails = request.body;
        const { playerName, jerseyNumber, role} =  playerDetails;
        const addPlayerQuery = `
        INSERT INTO 
        cricket_team (player_name,jersey_number, role)
        VALUES
        (
            '${playerName}',
            ${jerseyNumber},
            '${role}');`;

        const dbResponse = await db.run(addPlayerQuery);
        // console.lod(dbResponse)
        response.send("Player Added to Team");       

    } );
    // return a player based on a player id
    app.get("/players/:playerId/", async(request, response) => {
        const {playerId} = request.params;
        const getPlayerQuery = `
    SELECT 
    *
    FROM
    cricket_team
    WHERE 
    player_id = ${playerId};`;
      const player = await db.get(getPlayerQuery);
      response.send(convertDbObjectToResponseObject(player));

    });

// updates the details of  a player in the team (database) based on the player id

app.put("/players/:playerId/", async(request, response) => {
    const {playerId} = request.params;
    const playerDetails = request.body;
    const { playerName, jerseyNumber, role} = playerDetails;
    const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET 
    player_name = '${playerName}',
    jersery_number = ${jerseyNumber},
    role = '${role}
    WHERE 
    player_id = ${playerId};`;
      await db.run(updatePlayerQuery);
      response.send("Player Details Updated");

});


app.delete("/players/:playerId/", async (request, response) => {
    const { playerId} = request.params;
    const deletePlayerQuery = `
DELETE FROM
cricket_team
WHERE
player_id = ${playeId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");

});
module.exports = app;



















}