function point3(value, name) {
  if (!value || ![value.x, value.y, value.z].every(Number.isFinite)) throw new Error(`${name} must contain finite x, y, z.`);
}
export function translate3D(point, vector) { point3(point,"point"); point3(vector,"vector"); return {x:point.x+vector.x,y:point.y+vector.y,z:point.z+vector.z}; }
export function scale3D(point, factor, origin={x:0,y:0,z:0}) { point3(point,"point"); point3(origin,"origin"); if(!Number.isFinite(factor)) throw new Error("factor must be finite."); return {x:origin.x+(point.x-origin.x)*factor,y:origin.y+(point.y-origin.y)*factor,z:origin.z+(point.z-origin.z)*factor}; }
export function rotateZ(point, angleRadians, origin={x:0,y:0,z:0}) { point3(point,"point"); point3(origin,"origin"); if(!Number.isFinite(angleRadians)) throw new Error("angleRadians must be finite."); const x=point.x-origin.x,y=point.y-origin.y,c=Math.cos(angleRadians),s=Math.sin(angleRadians); return {x:origin.x+x*c-y*s,y:origin.y+x*s+y*c,z:point.z}; }
