"""A car written out by export_parts.js (its studio folder) loaded into Blender: one object for each of its pieces
   (the body, the lamps, the underside, what the hood hides, the hood, the bay, each wheel's turning and steering
   parts), each one mesh with a material slot for each of the materials on it, hung from its parent as the manifest
   says (the hood's origin on its hinge, each wheel's on its hub). Game axes (x forward, y up, z right) turned to
   Blender's (z up); a .glb turns them back.
   load(dir, target) -> (objects by name, manifest)"""
import os, json
import numpy as np
import bpy
from bl_mats import mat_for
G2B = np.array([[1, 0, 0], [0, 0, -1], [0, 1, 0]], dtype=np.float32)
g2b = lambda v: (v[0], -v[2], v[1])
def load(src, target='cycles', skip=()):
    man = json.load(open(os.path.join(src, 'manifest.json')))
    inv = {v: k for k, v in man['MAT'].items()}; inv.update({v: 'SM_' + k for k, v in man['SM'].items()})
    mats = {}; obs = {}
    by = {}
    for pc in man['pieces']: by.setdefault(pc['node'], []).append(pc)
    for nd in man['nodes']:
        name = nd['name']
        if name in skip: continue
        pcs = by.get(name, [])
        if pcs:
            Ps, Ns, Cs, Ms = [], [], [], []
            for slot, pc in enumerate(pcs):
                raw = np.fromfile(os.path.join(src, pc['file'] + '.bin'), dtype=np.float32); n = pc['tris']
                P = raw[:n * 9].reshape(-1, 3) @ G2B.T; N = raw[n * 9:n * 18].reshape(-1, 3) @ G2B.T; C = raw[n * 18:n * 30].reshape(-1, 4)
                N = N / (np.linalg.norm(N, axis=1, keepdims=True) + 1e-9)
                # (the game keeps no one winding: each triangle turned so its facing agrees with its normals)
                T3 = P.reshape(-1, 3, 3); g = np.cross(T3[:, 1] - T3[:, 0], T3[:, 2] - T3[:, 0]); bad = (g * N.reshape(-1, 3, 3).sum(1)).sum(1) < 0
                if bad.any():
                    for A, k in ((P, 3), (N, 3), (C, 4)):
                        V = A.reshape(-1, 3, k); V[bad] = V[bad][:, ::-1]
                Ps.append(P); Ns.append(N); Cs.append(C); Ms.append(np.full(n, slot, np.int32))
            P = np.concatenate(Ps); N = np.concatenate(Ns); C = np.concatenate(Cs); M = np.concatenate(Ms)
            # (corners at the same place share a vertex, so a .glb carries each point once where its normal and colour
            # agree; a triangle the welding collapses is dropped)
            key = np.round(P * 2e4).astype(np.int64); uq, vi = np.unique(key, axis=0, return_inverse=True); vi = vi.ravel().astype(np.int32)
            first = np.zeros(len(uq), np.int64); first[vi[::-1]] = np.arange(len(vi))[::-1]
            T = vi.reshape(-1, 3); ok = (T[:, 0] != T[:, 1]) & (T[:, 1] != T[:, 2]) & (T[:, 0] != T[:, 2])
            T = T[ok]; N = N.reshape(-1, 3, 3)[ok].reshape(-1, 3); C = C.reshape(-1, 3, 4)[ok].reshape(-1, 4); M = M[ok]; n = len(M)
            V = P[first]
            me = bpy.data.meshes.new(name)
            me.vertices.add(len(V)); me.vertices.foreach_set('co', V.ravel())
            me.loops.add(n * 3); me.loops.foreach_set('vertex_index', T.ravel())
            me.polygons.add(n); me.polygons.foreach_set('loop_start', np.arange(0, n * 3, 3, dtype=np.int32)); me.polygons.foreach_set('loop_total', np.full(n, 3, np.int32))
            me.update(); me.validate()
            me.polygons.foreach_set('material_index', M); me.polygons.foreach_set('use_smooth', np.ones(n, bool))
            if len(me.loops) == len(N): me.normals_split_custom_set(N.tolist())
            ca = me.color_attributes.new('col', 'BYTE_COLOR', 'CORNER'); ca.data.foreach_set('color', np.c_[np.clip(C[:, :3], 0, 1), np.ones(len(C))].astype(np.float32).ravel())
            for pc in pcs:
                if pc['mat'] not in mats: mats[pc['mat']] = mat_for(pc['mat'], inv, man['build'], target)
                me.materials.append(mats[pc['mat']])
            ob = bpy.data.objects.new(name, me)
        else:
            ob = bpy.data.objects.new(name, None)
        for k in ('lamp', 'steers', 'spins', 'hinge', 'open'):
            if k in nd: ob[k] = nd[k]
        bpy.context.scene.collection.objects.link(ob); obs[name] = ob
    for nd in man['nodes']:
        if nd['name'] not in obs: continue
        ob = obs[nd['name']]
        if nd['parent'] and nd['parent'] in obs: ob.parent = obs[nd['parent']]
        ob.location = g2b(nd['t'])
    return obs, man
