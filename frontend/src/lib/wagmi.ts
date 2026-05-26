import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy } from 'wagmi/chains';

// Use a placeholder project ID for now - wallet features will be added in Phase 4
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder-project-id';

export const config = getDefaultConfig({
  appName: 'ChainResume',
  projectId,
  chains: [polygonAmoy],
  ssr: false,
});
