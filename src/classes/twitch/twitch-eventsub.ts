import { env } from "@/lib/env";
import { TwitchAPP } from "../../axios/twitchApp";
import type {
  CreateEventSubSubscriptionRequest,
  CreateEventSubSubscriptionResponse,
  GetEventSubSubscriptionsRequest,
  GetEventSubSubscriptionsResponse,
  UpdateConduitRequest,
  UpdateConduitResponse,
  UpdateConduitShardsRequest,
  UpdateShardResponse,
  createConduitRequest,
  createConduitResponse,
  deleteConduitRequest,
  getConduitShardsRequest,
  getConduitShardsResponse,
  getConduitsResponse,
} from "../../types/twitchAPI";
import { twitch } from "../twitch";

class TwitchEventSub extends twitch {
  constructor() {
    super();
  }

  //get all conduits
  async getConducts(): Promise<getConduitsResponse> {
    try {
      const res = await TwitchAPP.get<getConduitsResponse>("/eventsub/conduits");
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //create a new conduit
  async createConduct({ shard_count }: createConduitRequest): Promise<createConduitResponse> {
    try {
      const res = await TwitchAPP.post<createConduitResponse>("/eventsub/conduits", {
        shard_count: shard_count,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // update a conduit
  async updateConduit({ id, shard_count }: UpdateConduitRequest): Promise<UpdateConduitResponse> {
    try {
      const res = await TwitchAPP.patch<UpdateConduitResponse>(`/eventsub/conduits?id=${id}`, {
        shard_count: shard_count,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //delete a conduit
  async deleteConduit({ id }: deleteConduitRequest) {
    try {
      const res = await TwitchAPP.delete(`/eventsub/conduits?id=${id}`, {
        headers: {
          "Client-ID": env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${env.TWITCH_SECRET}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  //get shards
  async getConduitShards({ after, conduit_id, status }: getConduitShardsRequest): Promise<getConduitShardsResponse> {
    try {
      const response = await TwitchAPP.get<getConduitShardsResponse>(`/eventsub/conduits/shards`, {
        params: { after, conduit_id, status },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching EventSub shards:", error);
      throw error;
    }
  }

  // update shards
  async updateConduitShards({ conduit_id, shards }: UpdateConduitShardsRequest): Promise<UpdateShardResponse> {

    console.log(shards)

    try {
      const res = await TwitchAPP.patch(`/eventsub/conduits/shards`, {
        conduit_id,
        shards,
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // create a new subscription
  public async createEventSubSubscription<T>({
    condition,
    transport,
    type,
    version,
  }: CreateEventSubSubscriptionRequest<T>): Promise<CreateEventSubSubscriptionResponse> {
    try {
      const response = await TwitchAPP.post("/eventsub/subscriptions", {
        type,
        version,
        condition,
        transport,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating EventSub subscription:", error);
      throw error;
    }
  }

  // delete a subscription
  public async deleteEventSubSubscription(subscriptionID: string): Promise<void> {
    try {
      await TwitchAPP.delete(`/eventsub/subscriptions?id=${subscriptionID}`);
    } catch (error) {
      console.error("Error deleting EventSub subscription:", error);
      throw error;
    }
  }

  // get all subscriptions
  public async getEventSubSubscriptions({
    after,
    status,
    type,
    user_id,
  }: GetEventSubSubscriptionsRequest): Promise<GetEventSubSubscriptionsResponse[]> {
    try {
      const response = await TwitchAPP.get("/eventsub/subscriptions", {
        params: { status, type: type, user_id: user_id, after },
      });
      return response.data.data
    } catch (error) {
      console.error("Error fetching EventSub subscriptions:", error);
      throw error;
    }
  }
}

export const EventsubAPI = new TwitchEventSub();
