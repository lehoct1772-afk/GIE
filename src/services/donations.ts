export interface DonationRecord {
  id: string;
  amount: string;
  donorName?: string;
  donorEmail?: string;
  timestamp: string;
  type: 'one-time' | 'recurring';
  status: 'pending' | 'completed' | 'failed';
  receiptGenerated: boolean;
  stripePaymentIntentId?: string;
}

export interface DonationHistoryEntry {
  id: string;
  amount: string;
  timestamp: string;
  type: 'one-time' | 'recurring';
  status: 'pending' | 'completed' | 'failed';
}

export interface ReceiptInfo {
  donationId: string;
  amount: string;
  date: string;
  donorName?: string;
  donorEmail?: string;
  gieVersion: string;
  buildNumber: string;
  description: string;
}

export const donationHistory: DonationHistoryEntry[] = [];

export const recordDonation = (
  amount: string,
  type: 'one-time' | 'recurring' = 'one-time',
  donorName?: string,
  donorEmail?: string
): DonationRecord => {
  const id = 'donation-' + Date.now();
  const timestamp = new Date().toISOString();

  const record: DonationRecord = {
    id,
    amount,
    donorName,
    donorEmail,
    timestamp,
    type,
    status: 'pending',
    receiptGenerated: false,
  };

  donationHistory.push({
    id,
    amount,
    timestamp,
    type,
    status: 'pending',
  } as DonationHistoryEntry);

  return record;
};

export const completeDonation = (donationId: string): void => {
  const record = donationHistory.find((d) => d.id === donationId);
  if (record) {
    record.status = 'completed';
  }

  const donationRecord = donationHistory.find((d) => d.id === donationId);
  if (donationRecord) {
    donationRecord.status = 'completed';
    donationRecord.receiptGenerated = true;
  }
};

export const generateReceipt = (
  donationId: string,
  donorName?: string,
  donorEmail?: string
): ReceiptInfo => {
  const historyEntry = donationHistory.find((d) => d.id === donationId);
  if (!historyEntry) {
    throw new Error('Donation record not found');
  }

  return {
    donationId,
    amount: historyEntry.amount,
    date: new Date(historyEntry.timestamp).toLocaleDateString(),
    donorName: donorName || historyEntry.donorName,
    donorEmail: donorEmail || historyEntry.donorEmail,
    gieVersion: 'GIE',
    buildNumber: '1.0',
    description: 'Geometric Intelligence Engine donation receipt',
  };
};

export const getDonationHistory = (): DonationHistoryEntry[] => {
  return [...donationHistory];
};

export const simulateStripePaymentIntent = (
  amount: string,
  donorEmail: string
): { clientSecret: string; paymentIntentId: string } => {
  // This is a STUB only - no real Stripe integration
  // In production, this would integrate with Stripe API
  const paymentIntentId = 'pi_stub_' + Date.now();
  const clientSecret = 'cs_stub_' + Date.now() + '_' + paymentIntentId;

  return { clientSecret, paymentIntentId };
};
