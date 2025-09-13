export interface ENSValidationResult {
  isValid: boolean;
  address?: string;
  error?: string;
}

/**
 * Validates if a string is a valid ENS name format
 */
export const isValidENSName = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  // ENS names should end with .eth or other TLDs
  const ensPattern = /^[a-zA-Z0-9-]+\.(eth|xyz|luxe|kred|art|club)$/i;
  return ensPattern.test(input.trim());
};

/**
 * Resolves an ENS name to an Ethereum address using ENS API
 */
export const resolveENSName = async (ensName: string): Promise<ENSValidationResult> => {
  try {
    if (!isValidENSName(ensName)) {
      return {
        isValid: false,
        error: 'Invalid ENS name format. ENS names should end with .eth or other supported TLDs.'
      };
    }

    const trimmedName = ensName.trim().toLowerCase();
    console.log('Resolving ENS name:', trimmedName);
    
    // Method 1: Try ENS API
    try {
      const response = await fetch(`https://api.ensideas.com/ens/resolve/${trimmedName}`);
      if (response.ok) {
        const data = await response.json();
        console.log('ENS API result:', data);
        
        if (data.address) {
          return {
            isValid: true,
            address: data.address
          };
        }
      }
    } catch (apiError) {
      console.log('ENS API failed:', apiError);
    }
    
    // Method 2: Use ethers.js with multiple providers
    const { JsonRpcProvider } = await import('ethers');
    
    const providers = [
      'https://eth-mainnet.g.alchemy.com/v2/demo',
      'https://ethereum.publicnode.com',
      'https://cloudflare-eth.com'
    ];
    
    for (const providerUrl of providers) {
      try {
        console.log(`Trying provider: ${providerUrl}`);
        const provider = new JsonRpcProvider(providerUrl);
        
        // Set a timeout for the resolution
        const address = await Promise.race([
          provider.resolveName(trimmedName),
          new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 8000)
          )
        ]);
        
        console.log(`Provider ${providerUrl} result:`, address);
        
        if (address) {
          return {
            isValid: true,
            address: address
          };
        }
      } catch (providerError) {
        console.log(`Provider ${providerUrl} failed:`, providerError);
        continue;
      }
    }

    return {
      isValid: false,
      error: 'ENS name not found or does not resolve to an address.'
    };

  } catch (error) {
    console.error('ENS resolution error:', error);
    return {
      isValid: false,
      error: 'Failed to resolve ENS name. Please check the name and try again.'
    };
  }
};

/**
 * Reverse resolves an Ethereum address to an ENS name (if available)
 */
export const reverseResolveAddress = async (address: string): Promise<string | null> => {
  try {
    const { JsonRpcProvider } = await import('ethers');
    const provider = new JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
    const ensName = await provider.lookupAddress(address);
    return ensName;
  } catch (error) {
    console.error('Reverse ENS resolution error:', error);
    return null;
  }
};
