uniform float uTime;
uniform float uFresnelPower;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - dot(vNormal, viewDir), uFresnelPower);
  
  float bands = sin(vUv.y * 20.0 + uTime * 2.0) * 0.5 + 0.5;
  vec3 rainbow = mix(uColor1, mix(uColor2, uColor3, bands), fresnel);
  
  float scanline = sin(vUv.y * 200.0) * 0.04;
  
  vec4 tex = texture2D(uTexture, vUv);
  vec3 finalColor = tex.rgb + rainbow * fresnel * 0.6 + scanline;
  
  float alpha = smoothstep(0.0, 0.02, vUv.x) *
                smoothstep(1.0, 0.98, vUv.x) *
                smoothstep(0.0, 0.02, vUv.y) *
                smoothstep(1.0, 0.98, vUv.y);
  
  gl_FragColor = vec4(finalColor, alpha * 0.97 + 0.03);
}
