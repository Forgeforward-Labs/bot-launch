import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Lock as LockIcon,
  Calendar,
  Coins,
  Shield,
  QrCode,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';

interface LockCertificateModalProps {
  lock: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LockCertificateModal({
  lock,
  open,
  onOpenChange,
}: LockCertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const generateQRCode = () => {
    // Generate QR code data URL for the lock details
    const lockUrl = `${window.location.origin}/lock/${lock.id}`;
    // Using a simple data URL for demonstration - in production, use a proper QR code library
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
      lockUrl,
    )}`;
    return qrData;
  };

  const { data: qrCode } = useQuery({
    queryKey: ['qrCode'],
    queryFn: () => generateQRCode(),
  });

  console.log('qrCode', qrCode);

  const downloadCertificate = async () => {
    console.log('Downloading certificate');
    if (!certificateRef.current) return;

    console.log('Downloading certificate');

    try {
      // Create a canvas and draw the certificate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Background gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = '#00bc7d';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(lock.isLpLock ? 'LP Lock Certificate' : 'Token Lock Certificate', canvas.width / 2, 80);

      // Logo/Icon area
      ctx.fillStyle = '#00bc7d';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 140, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Lock details
      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#e5e7eb';

      const details = [
        `Token: ${lock.tokenName} (${lock.tokenSymbol})`,
        `Amount: ${lock.amount} ${lock.tokenSymbol}`,
        `Lock Date: ${lock.lockDate}`,
        `Unlock Date: ${lock.unlockDate}`,
        `Status: ${lock.status}`,
        `Type: ${lock.isLpLock ? 'LP Lock' : lock.token === zeroAddress ? 'Native Token' : 'Token Lock'}`,
        lock.contractAddress ? `Contract: ${lock.contractAddress}` : '',
        lock.vestingEnabled ? `Vesting: ${lock.vestingPeriod} days` : '',
      ].filter(Boolean);

      details.forEach((detail, index) => {
        ctx.fillText(detail, 60, 220 + index * 30);
      });

      //   // QR Code placeholder
      //   ctx.fillStyle = "#ffffff";
      //   ctx.fillRect(canvas.width - 150, 200, 120, 120);
      //   ctx.fillStyle = "#000000";
      //   ctx.font = "12px Arial";
      //   ctx.textAlign = "center";
      //   ctx.fillText("QR Code", canvas.width - 90, 270);

      //   const qrCodeImage = new Image();
      //   qrCodeImage.src = qrCode ?? "";
      //   qrCodeImage.onload = () => {
      //     ctx.drawImage(qrCodeImage, canvas.width - 150, 200, 120, 120);
      //   };

      //   console.log("qrCodeImage", qrCodeImage, qrCode, qrCodeImage.src);

      // Footer
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Certificate ID: ${lock.id} | Generated on ${
          new Date().toISOString().split('T')[0]
        }`,
        canvas.width / 2,
        canvas.height - 40,
      );

      // Download the image
      //   const link = document.createElement("a");
      //   link.download = `lock-certificate-${lock.id}.png`;
      //   link.href = canvas.toDataURL();
      //   link.click();

      if (qrCode) {
        const qrCodeImage = new Image();
        qrCodeImage.crossOrigin = 'anonymous'; // if hosted externally
        qrCodeImage.src = qrCode;

        qrCodeImage.onload = () => {
          ctx.drawImage(qrCodeImage, canvas.width - 150, 200, 120, 120);

          // Download AFTER QR is drawn
          const link = document.createElement('a');
          link.download = `lock-certificate-${lock.id}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();

          console.log('Certificate Downloaded');
          onOpenChange(false);
          toast.success('Certificate Downloaded', {
            description: 'Lock certificate has been saved to your downloads',
          });
        };

        qrCodeImage.onerror = (err) => {
          console.log('QR Code Load Failed', err);
          toast.error('QR Code Load Failed');
        };
      } else {
        // If no QR, just download immediately
        const link = document.createElement('a');
        link.download = `lock-certificate-${lock.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

      console.log('Certificate Downloaded');
      onOpenChange(false);
      toast.success('Certificate Downloaded', {
        description: 'Lock certificate has been saved to your downloads',
      });
    } catch (error) {
      console.log('Download Failed', error, qrCode);
      toast.error('Download Failed', {
        description: 'Failed to generate certificate',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Lock Certificate - {lock.tokenName}
          </DialogTitle>
          <DialogDescription>
            Download a certificate for this token lock
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <Card
            ref={certificateRef}
            className="glass-card border-white/20 p-8 bg-gradient-to-br from-background to-background/50"
          >
            <CardContent className="space-y-6 p-0">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 gradient-primary rounded-xl">
                    <LockIcon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#00bc7d]">
                    {lock.isLpLock ? 'LP Lock Certificate' : 'Token Lock Certificate'}
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  This certificate validates the token lock created on our
                  platform
                </p>
              </div>

              {/* Lock Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 glass-card rounded-lg border border-white/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-primary" />
                      Token Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-semibold">{lock.tokenName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Symbol:</span>
                        <span className="font-semibold">
                          {lock.tokenSymbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-semibold">{lock.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant={lock.isLpLock ? 'default' : 'secondary'}>
                          {lock.isLpLock
                            ? 'LP Lock'
                            : lock.token === zeroAddress
                            ? 'Native Token'
                            : 'Token Lock'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 glass-card rounded-lg border border-white/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Lock Schedule
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Lock Date:
                        </span>
                        <span className="font-semibold">{lock.lockDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Unlock Date:
                        </span>
                        <span className="font-semibold">{lock.unlockDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={
                            lock.status === 'Unlockable'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {lock.status}
                        </Badge>
                      </div>
                      {lock.vestingEnabled && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Vesting:
                          </span>
                          <span className="font-semibold">
                            {lock.vestingPeriod} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* QR Code */}
                  <div className="p-4 glass-card rounded-lg border border-white/10 text-center">
                    <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
                      <QrCode className="h-4 w-4 text-primary" />
                      Verification QR Code
                    </h3>
                    <div className="flex justify-center">
                      <img
                        src={generateQRCode()}
                        alt="Lock verification QR code"
                        className="rounded-lg border border-white/20"
                        width={120}
                        height={120}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Scan to verify lock details
                    </p>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-4 glass-card rounded-lg border border-white/10">
                    <h3 className="font-semibold mb-3">Certificate Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Certificate ID:
                        </span>
                        <span className="font-mono text-xs">{lock.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Issue Date:
                        </span>
                        <span className="font-semibold">
                          {new Date().toISOString().split('T')[0]}
                        </span>
                      </div>
                      {lock.contractAddress && (
                        <div className="pt-2 border-t border-white/10">
                          <span className="text-muted-foreground text-xs">
                            Contract:
                          </span>
                          <p className="font-mono text-xs break-all mt-1">
                            {lock.contractAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground">
                  This certificate is generated by our secure token lock
                  platform. Verify authenticity using the QR code above.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Download Button */}
          <div className="flex justify-center">
            <Button
              onClick={downloadCertificate}
              variant="protocol"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
