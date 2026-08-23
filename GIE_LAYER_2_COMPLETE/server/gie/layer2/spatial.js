const EARTH_RADIUS_METERS = 6371008.8;
function radians(d){return d*Math.PI/180;}
function degrees(r){return r*180/Math.PI;}
function latLon(p,name){if(!p||!Number.isFinite(p.lat)||!Number.isFinite(p.lon)||p.lat < -90||p.lat > 90) throw new Error(`${name} requires lat [-90,90] and finite lon.`);}
export function greatCircleDistance(a,b,radius=EARTH_RADIUS_METERS){latLon(a,"a");latLon(b,"b");if(!Number.isFinite(radius)||radius<=0)throw new Error("radius must be positive and finite.");const p1=radians(a.lat),p2=radians(b.lat),dp=p2-p1,dl=radians(b.lon-a.lon);const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return radius*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export function sphericalToCartesian({lat,lon,radius=1}){latLon({lat,lon},"coordinate");if(!Number.isFinite(radius)||radius<0)throw new Error("radius must be non-negative and finite.");const p=radians(lat),l=radians(lon),cp=Math.cos(p);return{x:radius*cp*Math.cos(l),y:radius*Math.sin(p),z:radius*cp*Math.sin(l)};}
export function cartesianToSpherical({x,y,z}){if(![x,y,z].every(Number.isFinite))throw new Error("x, y, z must be finite.");const radius=Math.hypot(x,y,z);if(radius===0)throw new Error("Origin has no unique spherical coordinate.");return{lat:degrees(Math.asin(y/radius)),lon:degrees(Math.atan2(z,x)),radius};}
export { EARTH_RADIUS_METERS };
