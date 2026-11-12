import { CABIN } from "../constants";

/** Interior of the CEO cabin in room-local metres: origin at floor centre, +z towards the visitor, windows on -z. */
export const ROOM = {
  w: CABIN.shellW - CABIN.wall * 2,
  d: CABIN.shellD - CABIN.wall * 2,
  h: CABIN.shellH - 0.9, // leave the slab above
};

export const DESK = { x: 0, z: -5.6 };
export const TABLE = { x: -4.6, z: 0.6, r: 1.35 };
export const LOUNGE = { x: 5.6, z: 0.2 };
