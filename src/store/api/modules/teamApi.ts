import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  CreateTeamMemberInput,
  TeamWorkspaceResponse,
} from "@/store/api/types";

// Team endpoints expose member seats and workspace membership actions.
export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamWorkspace: builder.query<TeamWorkspaceResponse, void>({
      query: () => "/team",
      transformResponse: (response: ApiEnvelope<TeamWorkspaceResponse>) => response.data,
      providesTags: ["User"],
    }),
    createTeamMember: builder.mutation<
      { member: TeamWorkspaceResponse["members"][number]; seatSummary: TeamWorkspaceResponse["seatSummary"] },
      CreateTeamMemberInput
    >({
      query: (body) => ({
        url: "/team/members",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<{ member: TeamWorkspaceResponse["members"][number]; seatSummary: TeamWorkspaceResponse["seatSummary"] }>) => response.data,
      invalidatesTags: ["User"],
    }),
    deleteTeamMember: builder.mutation<{ seatSummary: TeamWorkspaceResponse["seatSummary"] }, string>({
      query: (id) => ({
        url: `/team/members/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<{ seatSummary: TeamWorkspaceResponse["seatSummary"] }>) => response.data,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetTeamWorkspaceQuery,
  useCreateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;
