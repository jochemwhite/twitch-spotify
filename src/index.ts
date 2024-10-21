import { EventSubSocket } from "@/classes/eventsub";
import { Elysia } from "elysia";
import { TwitchController } from "./controllers/twitch-controller";
import { SpotifyContoller } from "./controllers/spotify-controller";

const app = new Elysia();

app.use(TwitchController);
app.use(SpotifyContoller)

app.listen(3000);

console.log("Server is running on http://localhost:3000");

new EventSubSocket({
  connect: true,
});

