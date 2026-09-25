import resilientStore from '../models/resilientStore.js';

/**
 * GET /api/brands
 * Fetch all saved brand sessions for the authenticated user
 */
export async function handleGetBrandSessions(req, res) {
  try {
    const userId = req.user.id;
    const sessions = await resilientStore.getBrandSessionsByUser(userId);
    return res.status(200).json({
      sessions: sessions || [],
      count: (sessions || []).length
    });
  } catch (err) {
    console.error('[brandHistoryController] Error fetching brand sessions:', err);
    return res.status(500).json({ error: 'Failed to retrieve saved brands.', details: err.message });
  }
}

/**
 * POST /api/brands
 * Save a new brand session to the user's library
 */
export async function handleSaveBrandSession(req, res) {
  try {
    const userId = req.user.id;
    const { brandName, tagline, initialPitch, domain, brandKit } = req.body || {};

    if (!brandKit) {
      return res.status(400).json({ error: 'brandKit payload is required to save a session.' });
    }

    const resolvedBrandName = (
      brandName ||
      brandKit?.brandStrategy?.brandName ||
      'Untitled Brand'
    ).trim();

    const resolvedTagline = (
      tagline ||
      brandKit?.brandStrategy?.tagline ||
      ''
    ).trim();

    const resolvedDomain = (
      domain ||
      brandKit?.brandStrategy?.archetype ||
      'general'
    ).trim();

    const session = await resilientStore.createBrandSession({
      userId,
      brandName: resolvedBrandName,
      tagline: resolvedTagline,
      initialPitch: initialPitch || '',
      domain: resolvedDomain,
      brandKit
    });

    return res.status(201).json({
      session,
      message: `"${resolvedBrandName}" saved to your brand library.`
    });
  } catch (err) {
    console.error('[brandHistoryController] Error saving brand session:', err);
    return res.status(500).json({ error: 'Failed to save brand kit.', details: err.message });
  }
}

/**
 * POST /api/brands/sync-guest
 * Migrate guest-created brand kits into the authenticated user's library
 */
export async function handleSyncGuestBrands(req, res) {
  try {
    const userId = req.user.id;
    const { brandSessions } = req.body || {};

    if (!Array.isArray(brandSessions) || brandSessions.length === 0) {
      return res.status(200).json({ syncedCount: 0, message: 'No guest sessions to migrate.' });
    }

    const migrated = [];
    for (const item of brandSessions) {
      const kit = item.brandKit || item;
      if (!kit) continue;

      const brandName = (
        item.brandName ||
        kit?.brandStrategy?.brandName ||
        'Guest Brand'
      ).trim();

      const tagline = (
        item.tagline ||
        kit?.brandStrategy?.tagline ||
        ''
      ).trim();

      const initialPitch = item.initialPitch || '';
      const domain = item.domain || 'general';

      const saved = await resilientStore.createBrandSession({
        userId,
        brandName,
        tagline,
        initialPitch,
        domain,
        brandKit: kit
      });
      migrated.push(saved);
    }

    return res.status(200).json({
      syncedCount: migrated.length,
      sessions: migrated,
      message: `Successfully migrated ${migrated.length} guest brand kit(s) to your account.`
    });
  } catch (err) {
    console.error('[brandHistoryController] Error migrating guest brand kits:', err);
    return res.status(500).json({ error: 'Failed to migrate guest brand kits.', details: err.message });
  }
}

/**
 * DELETE /api/brands/:id
 * Delete a brand session belonging to the authenticated user
 */
export async function handleDeleteBrandSession(req, res) {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    const deleted = await resilientStore.deleteBrandSession(sessionId, userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Brand session not found or unauthorized.' });
    }

    return res.status(200).json({
      success: true,
      id: sessionId,
      message: 'Brand session deleted from library.'
    });
  } catch (err) {
    console.error('[brandHistoryController] Error deleting brand session:', err);
    return res.status(500).json({ error: 'Failed to delete brand session.', details: err.message });
  }
}
