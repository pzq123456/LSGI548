### **Simplified Table: Classification of Laser Scanning Systems**  

```py
def test():
    print("Hello World")
```
```sh
pandoc test.md -o test.docx --highlight-style=tango
```

test formular of normal distribution
$$
f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2} \left(\frac{x-\mu}{\sigma}\right)^2}
$$



| **Category**         | **Subtype**                 | **Key Characteristics**                        | **Typical Applications**                      |
|----------------------|----------------------------|------------------------------------------------|-----------------------------------------------|
| **Ranging Principle** | Pulsed                     | High-power, short-pulse lasers                 | Long-range scanning (e.g., airborne LiDAR)   |
|                      | CW Phase-Based             | Measures phase difference of modulated light   | High-precision short-range scanning          |
| **Laser Type**       | Gas Lasers                 | High coherence, limited modern use             | Early scanning systems                       |
|                      | Solid-State Lasers         | High power, used in pulsed systems             | Airborne and long-range terrestrial LiDAR    |
|                      | Semiconductor Lasers       | Compact, cost-effective, eye safety concerns   | Mobile and terrestrial LiDAR                 |
| **Wavelength**       | 800–1000 nm                | High sensitivity, eye safety concerns          | Urban mapping, forestry                      |
|                      | 1535 nm                    | Eye-safe, reduced sunlight interference        | Long-range airborne LiDAR                    |
|                      | 810 nm                     | High reflectivity for ice and snow             | Glacier and snow monitoring                  |
| **Detector Type**    | PIN Photodiodes            | Low sensitivity, short range                   | Low-cost or short-range systems              |
|                      | Avalanche Photodiodes (APD) | High sensitivity, extended range               | High-performance LiDAR                        |
| **Platform**         | Airborne                   | Large coverage, sparse points                  | Terrain mapping, forestry, urban modeling    |
|                      | Terrestrial                | High point density, precise measurements       | Deformation monitoring, cultural heritage     |
|                      | Mobile                     | Dense point clouds, stripe-shaped coverage     | Road mapping, urban infrastructure           |
|                      | Space-Based                | Large spot size, low density                   | Forestry, atmospheric, ice monitoring        |
| **Target Reflectivity** | High Reflectivity        | Maximizes range                                | Urban areas, man-made structures             |
|                      | Low Reflectivity           | Reduced range, wavelength-dependent            | Glacier and snow monitoring                  |  


```mermaid
graph LR
    A[Laser Scanning Systems] --> B[Ranging Principle]
    A --> C[Laser Type]
    A --> D[Wavelength]
    A --> E[Detector Type]
    A --> F[Platform]
    A --> G[Target Reflectivity]

    B --> B1[Pulsed]
    B1 -->|High-power, short pulses| B1a[Long-range scanning - Airborne LiDAR]
    B --> B2[CW Phase-Based]
    B2 -->|Measures phase difference| B2a[High-precision short-range scanning]

    C --> C1[Gas Lasers]
    C1 -->|High coherence, limited use| C1a[Early scanning systems]
    C --> C2[Solid-State Lasers]
    C2 -->|High power, used in pulsed systems| C2a[Airborne & long-range terrestrial LiDAR]
    C --> C3[Semiconductor Lasers]
    C3 -->|Compact, cost-effective, eye safety concerns| C3a[Mobile & terrestrial LiDAR]

    D --> D1[800-1000 nm]
    D1 -->|High sensitivity, eye safety concerns| D1a[Urban mapping, forestry]
    D --> D2[1535 nm]
    D2 -->|Eye-safe, reduced sunlight interference| D2a[Long-range airborne LiDAR]
    D --> D3[810 nm]
    D3 -->|High reflectivity for ice & snow| D3a[Glacier & snow monitoring]

    E --> E1[PIN Photodiodes]
    E1 -->|Low sensitivity, short range| E1a[Low-cost or short-range systems]
    E --> E2[Avalanche Photodiodes]
    E2 -->|High sensitivity, extended range| E2a[High-performance LiDAR]

    F --> F1[Airborne]
    F1 -->|Large coverage, sparse points| F1a[Terrain mapping, forestry, urban modeling]
    F --> F2[Terrestrial]
    F2 -->|High point density, precise measurements| F2a[Deformation monitoring, cultural heritage]
    F --> F3[Mobile]
    F3 -->|Dense point clouds, stripe-shaped coverage| F3a[Road mapping, urban infrastructure]
    F --> F4[Space-Based]
    F4 -->|Large spot size, low density| F4a[Forestry, atmospheric, ice monitoring]

    G --> G1[High Reflectivity]
    G1 -->|Maximizes range| G1a[Urban areas, man-made structures]
    G --> G2[Low Reflectivity]
    G2 -->|Reduced range, wavelength-dependent| G2a[Glacier & snow monitoring]
```