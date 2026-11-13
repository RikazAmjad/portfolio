$code = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class CharacterExtractor {
    public static void Extract(string inputPath, string outputPath) {
        Console.WriteLine("Loading image from " + inputPath);
        using (Bitmap srcBmp = new Bitmap(inputPath)) {
            int w = srcBmp.Width;
            int h = srcBmp.Height;
            Rectangle rect = new Rectangle(0, 0, w, h);
            BitmapData srcData = srcBmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            int totalBytes = Math.Abs(srcData.Stride) * h;
            byte[] srcBytes = new byte[totalBytes];
            System.Runtime.InteropServices.Marshal.Copy(srcData.Scan0, srcBytes, 0, totalBytes);
            srcBmp.UnlockBits(srcData);

            int stride = Math.Abs(srcData.Stride);

            // 1. Determine Sandal Sole Bottom Contour
            // Left sandal: x in [635, 825]
            // Right sandal: x in [940, 1215]
            int[] soleY = new int[w];
            for (int x = 0; x < w; x++) {
                soleY[x] = -1;
                bool isSandalX = (x >= 635 && x <= 825) || (x >= 940 && x <= 1215);
                if (isSandalX) {
                    for (int y = 2331; y >= 2150; y--) {
                        int idx = y * stride + x * 4;
                        byte b = srcBytes[idx];
                        byte g = srcBytes[idx + 1];
                        byte r = srcBytes[idx + 2];
                        int chroma = Math.Max(r, Math.Max(g, b)) - Math.Min(r, Math.Min(g, b));
                        int lum = (r * 299 + g * 587 + b * 114) / 1000;
                        if (lum < 85 && r >= b) {
                            soleY[x] = y;
                            break;
                        }
                    }
                }
            }

            for (int x = 636; x < 824; x++) {
                if (soleY[x] == -1 && soleY[x - 1] != -1 && soleY[x + 1] != -1) {
                    soleY[x] = (soleY[x - 1] + soleY[x + 1]) / 2;
                }
            }
            for (int x = 941; x < 1214; x++) {
                if (soleY[x] == -1 && soleY[x - 1] != -1 && soleY[x + 1] != -1) {
                    soleY[x] = (soleY[x - 1] + soleY[x + 1]) / 2;
                }
            }

            // 2. Identify Definite Background Pixels
            bool[] isBgCandidate = new bool[w * h];
            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    int pIdx = y * w + x;
                    int bIdx = y * stride + x * 4;
                    byte b = srcBytes[bIdx];
                    byte g = srcBytes[bIdx + 1];
                    byte r = srcBytes[bIdx + 2];

                    int chroma = Math.Max(r, Math.Max(g, b)) - Math.Min(r, Math.Min(g, b));
                    int lum = (r * 299 + g * 587 + b * 114) / 1000;

                    // Below entire sandal level:
                    if (y >= 2331) {
                        isBgCandidate[pIdx] = true;
                        continue;
                    }

                    // Left of left sandal (shadow floor):
                    if (x < 635 && y >= 2240) {
                        isBgCandidate[pIdx] = true;
                        continue;
                    }

                    // Right of right sandal (shadow floor):
                    if (x > 1215 && y >= 2240) {
                        isBgCandidate[pIdx] = true;
                        continue;
                    }

                    // Between the feet ground shadow:
                    if (x > 825 && x < 940 && y >= 2225) {
                        isBgCandidate[pIdx] = true;
                        continue;
                    }

                    // Below sandal sole:
                    if (soleY[x] != -1 && y > soleY[x] + 1) {
                        isBgCandidate[pIdx] = true;
                        continue;
                    }

                    // Background: bright, low chroma, neutral tone
                    // In open air or leg gap (protect glasses and coffee cup area):
                    bool inProtectedHead = (x >= 740 && x <= 1060 && y >= 360 && y <= 540);
                    bool inProtectedCup = (x >= 1110 && x <= 1260 && y >= 900 && y <= 1100);

                    if (!inProtectedHead && !inProtectedCup) {
                        if (lum >= 185 && chroma <= 16 && Math.Abs(r - g) <= 12 && Math.Abs(g - b) <= 12) {
                            isBgCandidate[pIdx] = true;
                        }
                    }
                }
            }

            // 3. Flood Fill from image borders
            bool[] isBg = new bool[w * h];
            Queue<int> q = new Queue<int>();

            Action<int, int> tryEnqueue = (x, y) => {
                int p = y * w + x;
                if (!isBg[p] && isBgCandidate[p]) {
                    isBg[p] = true;
                    q.Enqueue(p);
                }
            };

            // Seed 4 borders:
            for (int x = 0; x < w; x++) {
                tryEnqueue(x, 0);
                tryEnqueue(x, h - 1);
            }
            for (int y = 0; y < h; y++) {
                tryEnqueue(0, y);
                tryEnqueue(w - 1, y);
            }

            int[] dx = { 1, -1, 0, 0 };
            int[] dy = { 0, 0, 1, -1 };

            while (q.Count > 0) {
                int curr = q.Dequeue();
                int cy = curr / w;
                int cx = curr % w;

                for (int i = 0; i < 4; i++) {
                    int nx = cx + dx[i];
                    int ny = cy + dy[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        int np = ny * w + nx;
                        if (!isBg[np] && isBgCandidate[np]) {
                            isBg[np] = true;
                            q.Enqueue(np);
                        }
                    }
                }
            }

            // Seed enclosed air pockets:
            // Waving arm gap:
            tryEnqueue(620, 650);
            // Leg gap:
            tryEnqueue(895, 1750);
            tryEnqueue(895, 1850);
            tryEnqueue(895, 2000);
            tryEnqueue(880, 2150);

            // Continue BFS with seeds
            while (q.Count > 0) {
                int curr = q.Dequeue();
                int cy = curr / w;
                int cx = curr % w;

                for (int i = 0; i < 4; i++) {
                    int nx = cx + dx[i];
                    int ny = cy + dy[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        int np = ny * w + nx;
                        if (!isBg[np] && isBgCandidate[np]) {
                            isBg[np] = true;
                            q.Enqueue(np);
                        }
                    }
                }
            }

            // 4. Build Initial Foreground Alpha Mask
            byte[] alpha = new byte[w * h];
            for (int i = 0; i < w * h; i++) {
                alpha[i] = isBg[i] ? (byte)0 : (byte)255;
            }

            // 5. Anti-Aliased Edge Softening & Color Matting
            byte[] finalAlpha = (byte[])alpha.Clone();
            float bgR = 241f, bgG = 237f, bgB = 234f;

            for (int y = 2; y < h - 2; y++) {
                for (int x = 2; x < w - 2; x++) {
                    int p = y * w + x;
                    if (alpha[p] == 255) {
                        int bgNeighbors = 0;
                        for (int dy2 = -1; dy2 <= 1; dy2++) {
                            for (int dx2 = -1; dx2 <= 1; dx2++) {
                                if (alpha[(y + dy2) * w + (x + dx2)] == 0) {
                                    bgNeighbors++;
                                }
                            }
                        }

                        if (bgNeighbors > 0) {
                            int bIdx = y * stride + x * 4;
                            byte b = srcBytes[bIdx];
                            byte g = srcBytes[bIdx + 1];
                            byte r = srcBytes[bIdx + 2];

                            float dist = (float)Math.Sqrt((r - bgR) * (r - bgR) + (g - bgG) * (g - bgG) + (b - bgB) * (b - bgB));
                            float aVal;
                            if (dist <= 6f) {
                                aVal = 0f;
                            } else if (dist >= 32f) {
                                aVal = 255f;
                            } else {
                                aVal = ((dist - 6f) / 26f) * 255f;
                            }
                            finalAlpha[p] = (byte)Math.Min(255, Math.Max(0, (int)aVal));
                        }
                    }
                }
            }

            // 6. Create 32-bit ARGB Transparent PNG Image
            using (Bitmap destBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                BitmapData destData = destBmp.LockBits(rect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                byte[] destBytes = new byte[totalBytes];

                for (int y = 0; y < h; y++) {
                    for (int x = 0; x < w; x++) {
                        int p = y * w + x;
                        int bIdx = y * stride + x * 4;
                        byte a = finalAlpha[p];

                        if (a == 0) {
                            destBytes[bIdx] = 0;
                            destBytes[bIdx + 1] = 0;
                            destBytes[bIdx + 2] = 0;
                            destBytes[bIdx + 3] = 0;
                        } else if (a == 255) {
                            destBytes[bIdx] = srcBytes[bIdx];
                            destBytes[bIdx + 1] = srcBytes[bIdx + 1];
                            destBytes[bIdx + 2] = srcBytes[bIdx + 2];
                            destBytes[bIdx + 3] = 255;
                        } else {
                            // Un-premultiply edge pixels:
                            float aNorm = a / 255f;
                            float origB = srcBytes[bIdx];
                            float origG = srcBytes[bIdx + 1];
                            float origR = srcBytes[bIdx + 2];

                            float cleanB = (origB - (1f - aNorm) * bgB) / aNorm;
                            float cleanG = (origG - (1f - aNorm) * bgG) / aNorm;
                            float cleanR = (origR - (1f - aNorm) * bgR) / aNorm;

                            destBytes[bIdx] = (byte)Math.Min(255, Math.Max(0, (int)cleanB));
                            destBytes[bIdx + 1] = (byte)Math.Min(255, Math.Max(0, (int)cleanG));
                            destBytes[bIdx + 2] = (byte)Math.Min(255, Math.Max(0, (int)cleanR));
                            destBytes[bIdx + 3] = a;
                        }
                    }
                }

                System.Runtime.InteropServices.Marshal.Copy(destBytes, 0, destData.Scan0, totalBytes);
                destBmp.UnlockBits(destData);

                Console.WriteLine("Saving transparent PNG to " + outputPath);
                destBmp.Save(outputPath, ImageFormat.Png);
            }

            Console.WriteLine("Done! Character extracted successfully with transparent background.");
        }
    }
}
'@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$inputPath = "$PWD\public\Gemini_Generated_Image_95l5tl95l5tl95l5.jpg"
$outputPath = "$PWD\public\character_transparent.png"

[CharacterExtractor]::Extract($inputPath, $outputPath)
