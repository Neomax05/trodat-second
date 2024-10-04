import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './modules/config/configs';

// import { createCA, createCert } from 'mkcert';

const pathKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDcA+HMKsOECxBP
rZjvxX8bG08P1flTE3TMBmPTiFB7stPK313LBab/VQLVKuVmoBwkCTLovRU9egqF
dA3o0FB7rRVoLKCxeem1WFhAJiHXK9OyG2ve9GWD9bG1SYgFAgGeJ/N1v9829QvM
GvFHPdfgnIA4Hu4LxX9inHNTbPl/rldAWGrBhBJ0CsoPC/UiF2evEeFNXh38LlI4
j/As7XEOnI9K6a1DM1dzjI4E8vUMjM8j+WXvmioiCM2NY3drZb1bhkkS4M9en/QD
IqhKWNyrmh0fB43ylVq1tIz5LGJRUMFmXDppHNcoXeE2dT5DJXdQWzHZa3Hmry6U
GefM1bYhAgMBAAECggEAAgVfG5sA9MONQM4da4Zq5nrXvROAGM1C82TToevMoXZB
D8oBeI3yvMGxJvgf51NtLr+O4ihqe4gVdKheQFc5hglO+wf96eNuzCWlmeE/ylQy
u54Y3ZFtJUsqeLnWMAWWsjc3u0sp571UgGl28eqVgxCs9NcD5MPJqcQ6IvgLSqrw
8X50yCOuyucgCxKvyKoY5Xx9/oX9MDPeVDDdM6tRUg25TCWYZoL3U9y9+39Pu/Z8
GRsIhQ1QUpTt883GhMAjPjKlWhW7WpfFoZFd4MxEcxjTpIfhMSyY7ML6HXiWM9DP
/RBMg8K6KFGpUsLz6GzLey57nIXEg/EQteLVx/MwAQKBgQD1AJvShakx7vqJpz/A
HCCDE8Gju9W5A29FQtYTS5PPu8trIs5Bkof7C9K5rQNiGPP1/OXMIPc5aTXkAsg4
tLDzN3wDAxVLspDJfchL+wzhLOZvxFdDa0WDJs4mlX80S1/DkfRBiczQF/w3oNVI
AqPr5QwHdRuLSLJjlueNASZt4QKBgQDl5CNjP+jwbiKPauOoHdQ1lMT6zDlrsbSe
Xq42zmsR202XB2iVUa7U0tvqWsmg3j3RrB+qx+c/AyKhyai3QsJmfWPEeaV7B28t
WmdaietYeDSja+bXQ1yOsBx1gf73a5HRqA7ZYOkm8CO6aiHNsVLOnlq8QAE2sAa4
uVmegG3QQQKBgHOUXu44ufHhgHXR3cQ+QKQ1fMNGSHPoh+SPvDgMDmYQfM1E9TJ/
8wBeuoF3ekIb7XMdZDchUh/WX2L6YQRHUbbbdPhiyvgT/DPhz8zwWUodCXSullAq
2fceJmCTZBgCeuHjB+ynGmUM+6IukI9RF42gV0VpXJ4fpHBQ71lYso1hAoGAanj0
DtaduyU3KndWAxn1m+9QH9wQSBmgzqyJQWbu3fFVCTrsLCQNthIGuo7bzX7A4Og4
Lm+xYVTBaG8ujdoEkVVHrMquYsG5syaosZ0o++uIbZve6RoQtyFHvQC9JriSa6jL
X9Bri5Yy5fabu1mCQaHD4mY+aaazJkDqCefvdEECgYBX9udYYWgxFJAT6Qj4zmjB
2bdBdPvJCSlkSNe7859OVl2qkDPxuBElFsJsyYrd2sJ8/K1dcFtZYloBiK6zOR/q
6oSkCfqO0LUKRVvTNweLQtBYWmgiZYJUA6jjp0l4ZDZEZ5dJ/L5R74eihReqAn64
I15hxEpu42WTZOdLhuUKhA==
-----END PRIVATE KEY-----
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCf1Lrhm5IE+Ysn
PlcpfYexiti/O8rhR+sCDlfo8qRP+aFy/vPR0XmuccGFDGsu5Hv/7C+jIulJKyiO
oVwF1HLPnLOc99pX/zE0H2INcSB8q6CMZhOQsx3v/HwRvrcouZHEQl9E1hFwZUMU
mhEJDvcbsDmL+Ea1K3H408enLo7sUspb8j49BfUiqpEjD9eONv/E1gXmJzcqiMpT
+GR8PYGoDWeo0CZcfYz2MKJXklM/wz7gQG051CbBpTDxRW4Kvb3GyAxSd0Lq5qo6
XISuzYDwfmfLy2XbQRdiTTRQZFrOlyZNb8rDYdlawKca4A1W8yGNP84tp0M1rwx/
ejhg/K5dAgMBAAECggEAdcOobtLRpBi6DxA/6LI1aPuE+GJ1+cejwMAQxfMCXmrw
Kmrv+4j8vyvSCtY7ozF2q/q6ntj6So8iMvVxeFowvggXz3BP0MaW2nDFLmJMLY/H
m6saf2N6i3jdcbWz/q28WX8N8wpHjykNZACgzKvaJuyRejBU6Og58b0ZPnVvmW+8
zazNLP+XFeza3/QOD9LsDsdc8vGeD+CmrcEXwTqmOTdFYr65gTvYfEvC/tf6x6P/
gbzQ9bmyuaIDRdIAH9fSGpA8d5phN27i6ojGifKkKb0Nkl5s6o4hAdM53+WIa/MY
jjNb88Blv4SrZnBNMBi43s3hdaUh9Z2aYaDl/OzYAQKBgQDHlBb+UisXA6rl/ShE
3weWfak2e6O5xefdDxgGSst4KmQai5IErBpHM50V2bblZD5vZELhMdNJRtJiIL+W
5QqqUWAxvkBdJto7iUDuYzAngfoBBghitSibZTPS9u1OxbA3w0qf3eahZhWxdDmq
l1wE97TnkRJs/r3qga/OWl+aTQKBgQDNBAflBL5YUuPtPkE+Lbzrjyw9NYGIlPw/
eOrbYbKiPTVE1UoyUJe6Lkfjooclwj9i4PNwR7wc03CY/o3zuSrAvgDBQn4Et5Qu
bgjV0Hxc2AhDvjvOVyaA/llcVAoWoUU7jaUHZvFUHi0xI4jDRsTeiaGh4pyD9npL
OFgzPaZMUQKBgAhbMvtDBXrZNHacuurnS7IJYORfGOPWXXbsAt2AlDRb0gUqgtqf
OhpxFsqravT/1X1kfUhghbAzvutM47i1rlSjQ5vRk3BTCCAmBwn0LTf6QTV5wzAe
1axr+FeE7zq1HEO5cY5wBBAN7iqX6zIxVDEBDhoEAPl/UQRYmbvSHN6hAoGAL8MU
o8IrJiCJgSfTw0ycirRcNhZVCyDKc28UJ+/m0e04j8Sw+G/WKUXG8b1XhvBuG/cU
P8A2jvCjdsE3COTGlQiu3FdFTIwINZjk7gsYLfkWU9Hp1PRwv/SBlQTvJL6Fho5F
OCg/aL1vAdepcPT3wHCH+1Lz67psW0HRKn7eU0ECgYAuXdWAQtr01wjNGJfJR4/7
Ol7htKolNPP2oYaeu/scZ+Jt9cQovmi2b5tP2xYweNzhFF9S2BwuhFS7Dh81xylM
81e65gdbGP0Jtw13RhujRFzCBrr5pksjahU75zTFLTm+JN3kTZRsaEzZ19Z0LwsR
KpUKAV53F/wpI58p9E1dng==
-----END PRIVATE KEY-----
`;

const pathCert = `-----BEGIN CERTIFICATE-----
MIIEeDCCAuCgAwIBAgIQOXLxeyJtQgPYUltoQLoYGjANBgkqhkiG9w0BAQsFADCB
pTEeMBwGA1UEChMVbWtjZXJ0IGRldmVsb3BtZW50IENBMT0wOwYDVQQLDDRudXJ0
aW1heDA1QE51cnRpbWF4cy1NYWNCb29rLVByby5sb2NhbCAoTnVydGltYXggMDUp
MUQwQgYDVQQDDDtta2NlcnQgbnVydGltYXgwNUBOdXJ0aW1heHMtTWFjQm9vay1Q
cm8ubG9jYWwgKE51cnRpbWF4IDA1KTAeFw0yNDEwMDQxMTI0MjFaFw0yNzAxMDQx
MTI0MjFaMGgxJzAlBgNVBAoTHm1rY2VydCBkZXZlbG9wbWVudCBjZXJ0aWZpY2F0
ZTE9MDsGA1UECww0bnVydGltYXgwNUBOdXJ0aW1heHMtTWFjQm9vay1Qcm8ubG9j
YWwgKE51cnRpbWF4IDA1KTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
ANwD4cwqw4QLEE+tmO/FfxsbTw/V+VMTdMwGY9OIUHuy08rfXcsFpv9VAtUq5Wag
HCQJMui9FT16CoV0DejQUHutFWgsoLF56bVYWEAmIdcr07Iba970ZYP1sbVJiAUC
AZ4n83W/3zb1C8wa8Uc91+CcgDge7gvFf2Kcc1Ns+X+uV0BYasGEEnQKyg8L9SIX
Z68R4U1eHfwuUjiP8CztcQ6cj0rprUMzV3OMjgTy9QyMzyP5Ze+aKiIIzY1jd2tl
vVuGSRLgz16f9AMiqEpY3KuaHR8HjfKVWrW0jPksYlFQwWZcOmkc1yhd4TZ1PkMl
d1BbMdlrceavLpQZ58zVtiECAwEAAaNgMF4wDgYDVR0PAQH/BAQDAgWgMBMGA1Ud
JQQMMAoGCCsGAQUFBwMBMB8GA1UdIwQYMBaAFOjLk2YLGVwrUG0RAl6JhXFN91Kp
MBYGA1UdEQQPMA2CC2NyZWF0ZS1jZXJ0MA0GCSqGSIb3DQEBCwUAA4IBgQCMV99T
EAAFS0hYtCF5NFjZhMS5JQs12+rivC8GTXUMhTv4YxX/Wy52vDgyA8c7fOOzygNn
HPQSfoIzMW+0fqqbAEkQVIj+/tzOUL5IBv9ko0fqIGvYROa9VagNFu12OCPbDXoU
nJDOcNEk8fkoufoo7p9Pr+fZeHYT4gWCaUfh4hYeMsrKTk2/JDCePjc9OWB5dAXr
RhrHIfpGqwEBpIKWsoaUjdUm3eG1d2Q5iVBkqtWuX2vVf3ZdWeSejFcBE7eRt07A
AVXS9ph+Y57Hcp2PPKH2HjqpwvXPgRxkxVAXpwXMeiZ5oE31psfJAwMi5osEL3M7
B7XUakFRkbylx+7qR1Wg9xr8Xs3kvuKnnuM6UeoAkQmjHV683G5ypRKhbsaar3UV
BV09t0Tc0n9Rv8iAlX9NDaFAHLedNtOgnDL5WOP2sHzUxsa36jjTXuUI31J3S9x1
/IAMFXwVi54qcewKJgmxew/pRR+GJT85kNKRUfeBtMi/Pauu5sbWIFFqEVs=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIEdzCCAt+gAwIBAgIRAP5eFGBgdEsj9mJyL7Lq3/gwDQYJKoZIhvcNAQELBQAw
gaUxHjAcBgNVBAoTFW1rY2VydCBkZXZlbG9wbWVudCBDQTE9MDsGA1UECww0bnVy
dGltYXgwNUBOdXJ0aW1heHMtTWFjQm9vay1Qcm8ubG9jYWwgKE51cnRpbWF4IDA1
KTFEMEIGA1UEAww7bWtjZXJ0IG51cnRpbWF4MDVATnVydGltYXhzLU1hY0Jvb2st
UHJvLmxvY2FsIChOdXJ0aW1heCAwNSkwHhcNMjQxMDA0MTEyMzUyWhcNMjcwMTA0
MTEyMzUyWjBoMScwJQYDVQQKEx5ta2NlcnQgZGV2ZWxvcG1lbnQgY2VydGlmaWNh
dGUxPTA7BgNVBAsMNG51cnRpbWF4MDVATnVydGltYXhzLU1hY0Jvb2stUHJvLmxv
Y2FsIChOdXJ0aW1heCAwNSkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQCf1Lrhm5IE+YsnPlcpfYexiti/O8rhR+sCDlfo8qRP+aFy/vPR0XmuccGFDGsu
5Hv/7C+jIulJKyiOoVwF1HLPnLOc99pX/zE0H2INcSB8q6CMZhOQsx3v/HwRvrco
uZHEQl9E1hFwZUMUmhEJDvcbsDmL+Ea1K3H408enLo7sUspb8j49BfUiqpEjD9eO
Nv/E1gXmJzcqiMpT+GR8PYGoDWeo0CZcfYz2MKJXklM/wz7gQG051CbBpTDxRW4K
vb3GyAxSd0Lq5qo6XISuzYDwfmfLy2XbQRdiTTRQZFrOlyZNb8rDYdlawKca4A1W
8yGNP84tp0M1rwx/ejhg/K5dAgMBAAGjXjBcMA4GA1UdDwEB/wQEAwIFoDATBgNV
HSUEDDAKBggrBgEFBQcDATAfBgNVHSMEGDAWgBToy5NmCxlcK1BtEQJeiYVxTfdS
qTAUBgNVHREEDTALggljcmVhdGUtY2EwDQYJKoZIhvcNAQELBQADggGBAKYWsOJD
nXuybFUKh2hknFgGn2n1+SBf0RkJW0oTAK9TAfy2Qh1fUEYuqOLcLdhIfKm6Ck+T
dTmMWCZyl4rifZFmXZbxcf2Jx6M49YD2UN1wXPCcwFJycddpmzQ9HlYK75EKQfMz
S5Fk1MGPEiNj0BvoPjAdrXiTKKftgE/X6faILvzoDsCyEXzkxfMiCO2IlwN4vYy7
3Qk4p0F5cGXjttHWQ+RyHylOM5AyWL1vi5TER+ND26zsRqKqCIE9JhXnyIK6oTVN
Qmesm/CCpI9jbYGcMdEHmdvCdlotQ0v+hWHjCW+Ar1x3NgL7KI+hjdNb9tyG+jP7
dmNEumuH0dzOLDl3qMLuhvMXFoEaD2vDDqjxQ5Nk3g54KMDFIRaLhLyiO3eiZHzt
GX/+JIsSHIPdGBz8hzj2gpM5+2LheDMjtXI17MO0Jt+y1EMidpGJK+XWMKNGF3vX
XJYIHY9CWWw0O66yWtkQzYdL6Q1CAAGAtyHh72O1kt6yzFMWWDjgijaptQ==
-----END CERTIFICATE-----
`;

const httpsOptions = {
  key: pathKey,
  cert: pathCert,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors();
  const appConfig = app.get(AppConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.setGlobalPrefix('api');

  await app.listen(appConfig.port, () => {
    console.log('Server was started on port: ' + appConfig.port);
  });
}
bootstrap();
