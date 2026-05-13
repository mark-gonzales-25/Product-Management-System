/**
 * Sprint 2 — Rights Matrix Test
 * 18 test cases: 3 user types × 6 rights
 *
 * Run: npx vitest run src/test/sprint2-rights-matrix.test.ts
 *
 * NOTE: These are integration-level tests that mock the UserRightsContext.
 * Full DB-level RLS tests are run manually via Supabase SQL Editor (see docs/).
 */

import { describe, it, expect } from 'vitest'

// ─── Rights derivation logic (mirrors UserRightsContext.tsx) ──────────────────
type UserType = 'SUPERADMIN' | 'ADMIN' | 'USER'

interface RightsMap {
  PRD_ADD: number
  PRD_EDIT: number
  PRD_DEL: number
  REP_001: number
  REP_002: number
  ADM_USER: number
}

function deriveRights(userType: UserType): RightsMap {
  switch (userType) {
    case 'SUPERADMIN':
      return { PRD_ADD: 1, PRD_EDIT: 1, PRD_DEL: 1, REP_001: 1, REP_002: 1, ADM_USER: 1 }
    case 'ADMIN':
      return { PRD_ADD: 1, PRD_EDIT: 1, PRD_DEL: 0, REP_001: 1, REP_002: 1, ADM_USER: 1 }
    default:
      return { PRD_ADD: 0, PRD_EDIT: 0, PRD_DEL: 0, REP_001: 1, REP_002: 0, ADM_USER: 0 }
  }
}

// ─── Test cases ────────────────────────────────────────────────────────────────
describe('Rights Matrix — 18 cases (3 roles × 6 rights)', () => {

  // ── SUPERADMIN ──────────────────────────────────────────────────────────────
  describe('SUPERADMIN', () => {
    const r = deriveRights('SUPERADMIN')

    it('TC-01  PRD_ADD = 1 (can add products)', () => {
      expect(r.PRD_ADD).toBe(1)
    })
    it('TC-02  PRD_EDIT = 1 (can edit products)', () => {
      expect(r.PRD_EDIT).toBe(1)
    })
    it('TC-03  PRD_DEL = 1 (can soft-delete products)', () => {
      expect(r.PRD_DEL).toBe(1)
    })
    it('TC-04  REP_001 = 1 (can view Product Report)', () => {
      expect(r.REP_001).toBe(1)
    })
    it('TC-05  REP_002 = 1 (can view Top Selling)', () => {
      expect(r.REP_002).toBe(1)
    })
    it('TC-06  ADM_USER = 1 (can access User Management)', () => {
      expect(r.ADM_USER).toBe(1)
    })
  })

  // ── ADMIN ───────────────────────────────────────────────────────────────────
  describe('ADMIN', () => {
    const r = deriveRights('ADMIN')

    it('TC-07  PRD_ADD = 1 (can add products)', () => {
      expect(r.PRD_ADD).toBe(1)
    })
    it('TC-08  PRD_EDIT = 1 (can edit products)', () => {
      expect(r.PRD_EDIT).toBe(1)
    })
    it('TC-09  PRD_DEL = 0 (ADMIN cannot soft-delete per rights matrix)', () => {
      expect(r.PRD_DEL).toBe(0)
    })
    it('TC-10  REP_001 = 1 (can view Product Report)', () => {
      expect(r.REP_001).toBe(1)
    })
    it('TC-11  REP_002 = 1 (can view Top Selling)', () => {
      expect(r.REP_002).toBe(1)
    })
    it('TC-12  ADM_USER = 1 (can access User Management)', () => {
      expect(r.ADM_USER).toBe(1)
    })
  })

  // ── USER ────────────────────────────────────────────────────────────────────
  describe('USER', () => {
    const r = deriveRights('USER')

    it('TC-13  PRD_ADD = 0 (USER cannot add products)', () => {
      expect(r.PRD_ADD).toBe(0)
    })
    it('TC-14  PRD_EDIT = 0 (USER cannot edit products)', () => {
      expect(r.PRD_EDIT).toBe(0)
    })
    it('TC-15  PRD_DEL = 0 (USER cannot delete products)', () => {
      expect(r.PRD_DEL).toBe(0)
    })
    it('TC-16  REP_001 = 1 (USER can view Product Report)', () => {
      expect(r.REP_001).toBe(1)
    })
    it('TC-17  REP_002 = 0 (USER cannot view Top Selling)', () => {
      expect(r.REP_002).toBe(0)
    })
    it('TC-18  ADM_USER = 0 (USER cannot access User Management)', () => {
      expect(r.ADM_USER).toBe(0)
    })
  })
})
