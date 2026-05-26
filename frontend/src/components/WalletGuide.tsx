import { useState } from 'react';

interface WalletGuideProps {
  onClose: () => void;
}

export const WalletGuide = ({ onClose }: WalletGuideProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);

  const handleAddNetwork = async () => {
    setIsAddingNetwork(true);
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install it first.');
        return;
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x13882',
            chainName: 'Polygon Amoy Testnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
            blockExplorerUrls: ['https://amoy.polygonscan.com/'],
          },
        ],
      });

      alert('Network added successfully!');
      setCurrentStep(3);
    } catch (error: any) {
      console.error('Failed to add network:', error);
      alert(`Failed to add network: ${error.message}`);
    } finally {
      setIsAddingNetwork(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid rgba(0,255,148,0.3)',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          padding: '40px',
          boxShadow: '0 0 60px rgba(0,255,148,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '28px',
                fontWeight: 700,
                color: 'white',
              }}
            >
              CONNECT YOUR WALLET
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Follow these steps to connect your wallet and mint your resume on-chain
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Step 1: Install MetaMask */}
          <div
            style={{
              padding: '20px',
              background: currentStep === 1 ? 'rgba(0,255,148,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${
                currentStep === 1 ? 'rgba(0,255,148,0.3)' : 'rgba(255,255,255,0.06)'
              }`,
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 1 ? 'var(--green)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: currentStep >= 1 ? '#020208' : 'var(--muted)',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Install MetaMask
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                  MetaMask is a crypto wallet that lets you interact with blockchain apps
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: 'var(--green)',
                    color: '#020208',
                    fontFamily: 'Space Grotesk',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,148,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Install MetaMask →
                </a>
              </div>
            </div>
          </div>

          {/* Step 2: Add Polygon Amoy Testnet */}
          <div
            style={{
              padding: '20px',
              background: currentStep === 2 ? 'rgba(0,255,148,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${
                currentStep === 2 ? 'rgba(0,255,148,0.3)' : 'rgba(255,255,255,0.06)'
              }`,
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 2 ? 'var(--green)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: currentStep >= 2 ? '#020208' : 'var(--muted)',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Add Polygon Amoy Testnet
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                  This is the test network where your resume will be minted (free!)
                </p>
                <button
                  onClick={handleAddNetwork}
                  disabled={isAddingNetwork}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--green)',
                    color: '#020208',
                    fontFamily: 'Space Grotesk',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isAddingNetwork ? 'not-allowed' : 'pointer',
                    opacity: isAddingNetwork ? 0.7 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isAddingNetwork) {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,148,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isAddingNetwork ? 'Adding Network...' : 'Add Network'}
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Get Free Test MATIC */}
          <div
            style={{
              padding: '20px',
              background: currentStep === 3 ? 'rgba(0,255,148,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${
                currentStep === 3 ? 'rgba(0,255,148,0.3)' : 'rgba(255,255,255,0.06)'
              }`,
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 3 ? 'var(--green)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: currentStep >= 3 ? '#020208' : 'var(--muted)',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Get Free Test MATIC
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                  You need test tokens to pay for gas fees (it's free, just for testing)
                </p>
                <a
                  href="https://faucet.polygon.technology/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid var(--green)',
                    color: 'var(--green)',
                    fontFamily: 'Space Grotesk',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,255,148,0.1)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,148,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Get Test MATIC →
                </a>
              </div>
            </div>
          </div>

          {/* Step 4: Connect to ChainResume */}
          <div
            style={{
              padding: '20px',
              background: currentStep === 4 ? 'rgba(0,255,148,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${
                currentStep === 4 ? 'rgba(0,255,148,0.3)' : 'rgba(255,255,255,0.06)'
              }`,
              borderRadius: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentStep >= 4 ? 'var(--green)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: currentStep >= 4 ? '#020208' : 'var(--muted)',
                  flexShrink: 0,
                }}
              >
                4
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  Connect to ChainResume
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                  Click the "Connect Wallet" button to link your MetaMask wallet
                </p>
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #00FF94 0%, #00CC77 100%)',
                    color: '#020208',
                    fontFamily: 'Space Grotesk',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,148,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  CONNECT WALLET
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '6px',
          }}
        >
          <p style={{ fontSize: '12px', color: 'var(--blue)', lineHeight: 1.6 }}>
            <strong>Why blockchain?</strong> Your resume is stored on IPFS (decentralized storage) and
            verified on Polygon blockchain. This means your credentials are permanent, tamper-proof, and
            verifiable by anyone.
          </p>
        </div>
      </div>
    </div>
  );
};
