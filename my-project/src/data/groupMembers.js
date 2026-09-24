import { allPeople } from "./communityPeople";

// Group membership is just a list of person IDs from the shared people list,
// plus per-membership flags (isNearby) that don't belong on the person record itself.
const membershipMeta = {
  p1: { isNearby: true },
  p2: { isNearby: false },
  p3: { isNearby: false },
  p4: { isNearby: true },
  p5: { isNearby: false },
};

export const groupMembers = allPeople.map((person) => ({
  ...person,
  isNearby: membershipMeta[person.id]?.isNearby || false,
}));
