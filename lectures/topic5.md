# GNSS Principles and Applications

## 01 Introduction to GNSS systems
PNT : Positioning, Navigation, and Timing

## 02 GNSS System Components


Three segments included:
- Space Segment
  - Satellite in Space
- Ground (Control) Segment
  - 5 monitor stations and 1 master control centre (original design)
  - After modernization: 1 MC + 1 alt.MC + 16 monitoring stations + 11 ground antennas
- User Segment
  - Any users with GPS receivers

### Monitor Stations
- Track GPS satellites as they pass overhead
- Collect navigation signals, range/carrier measurements, and atmospheric data
- Feed observations to the master control station
- Utilize sophisticated GPS receivers
- Provide global coverage via 16 sites: 6 from the Air Force plus 10 from NGA

### Master Control Station
- Provides command and control of the GPS constellation
- Uses global monitor station data to compute the precise locations of the satellites
- Generates navigation messages for upload to the satellites
- Monitors satellite broadcasts and system integrity to ensure constellation health and accuracy
- Performs satellite maintenance and anomaly resolution, including repositioning satellites to maintain optimal constellation
- Currently uses separate systems (AEP & LADO) to control operational and non-operational satellites
- Backed up by a fully operational alternate master control station

### Ground Antennas
- Send commands, navigation data uploads, and processor program loads to the satellites
- Collect telemetry
- Communicate via S-band and perform S-band ranging to provide anomaly resolution and early orbit support
- Consist of 4 dedicated GPS ground antennas plus 7 Air Force Satellite Control Network (AFSCN) remote tracking stations

### GPS Satellite Constellation
- 31 now in operation
- 20200 km above Earth
- 12 hr Orbits
- 6 Orbital Planes
- At least 4 satellites in view

### GPS Receiver
- Antenna & preamplifier
- Radio Frequency section
- Microprocessor
- Terminal or control and display unit
- Recording device
- Power supply

## 03 Signal Structure


- P   - Data   - C/A  -> modulation -> Demodulation

```mermaid

```

Signal is a function that conveys information about some measurements. In electronics, it refers to any
time-varying electromagnetic wave that carries information. Signal needs to be processed so that the
carried information can be extracted and used.
Characteristics of Signals
The three main features of signals are:
- Amplitude (A) ⇒ the peak of the signal from the center line
- Frequency (f) ⇒ how often signal sequences repeats across time
- Phase (ϕ) ⇒ how many degrees the signal shifts from the original point

Code-Division Multiple Access (CDMA)
CDMA is a technique for allowing multiple users on one frequency band at the same time. Each user is assigned a
pseudorandom noise (PRN) code (this will be introduced later), just like the bar codes assigned for different
products in shopping malls.

### GPS Signal Structure
GPS uses CDMA and PSK for signal modulation; thus, it’s composed of three parts: carrier wave, pseudorandom code,
and data (navigation message). Pseudorandom code and data are modulated through PSK onto carrier wave, which is
in the form of a sine wave. Then satellites will transmit the GPS signal out into space.

### Signal Acquisition

To determine visible satellites, the user detects the correlation peak between the received signal and a copied signal. This involves a 3D search across:
- 31 satellites
- 41 Doppler bins (±10 kHz range, 500 Hz bin size)
- 1023 code phases (PRN code length)

### Speedup Using Priors

To speed up signal acquisition:
- Almanac data reduces the satellite search dimension.
- Ephemeris data narrows the Doppler shift and code phase search.
- C/A code acquisition helps in reducing the P code phase possibilities.


### Signal Tracking

Signal tracking refines the rough estimations from signal acquisition to accurately determine the carrier phase. This dynamic process adjusts estimations over time using different modules:
- **Frequency-locked loop (FLL)**: Tracks carrier frequency
- **Phase-locked loop (PLL)**: Tracks carrier phase
- **Delay lock loop (DLL)**: Tracks code phase

These loops are electronic control systems based on negative feedback.

### Feedback Systems

Feedback occurs when system outputs are routed back as inputs, forming a loop. There are two types:
- **Positive feedback**: Output increases the input, potentially destabilizing the system.
- **Negative feedback**: Output decreases the input, stabilizing the system.

For example, adjusting water temperature while bathing uses negative feedback to maintain a suitable temperature. GPS signal tracking uses negative feedback loops to stabilize and accurately track signals.



## 04 Basic Observables of GNSS

### Pseudorange Measurement

The Pseudorange measurement \( R_P \) includes several factors besides signal propagation through the atmosphere. These factors are relativistic effects, instrumental delays, geometric range \( \rho \), and clock synchronization errors.

The equation for GNSS measurements is:

$$
R_P = \rho + c(d_{tr} - d_{ts}) + T_d + I_d + K_{P,r} - K_{P,s} + M_P + \epsilon_P
$$

where:
- \( R_P \): GNSS code measurement at frequency \( f \)
- \( c \): Speed of light
- \( d_{tr}, d_{ts} \): Receiver and satellite clock errors
- \( T_d \): Tropospheric delay
- \( I_d \): Ionospheric delay
- \( K_{P,r}, K_{P,s} \): Instrumental delays of receiver and satellite
- \( M_P \): Multipath error
- \( \epsilon_P \): Receiver noise

### Carrier Phase Measurement

Carrier phase measurements provide a more precise measure of the distance between satellite and receiver but include an unknown integer number of wavelengths \( \lambda N \).

The carrier phase measurements \( \Phi_L \) can be modeled as:

$$
\Phi_L = \rho + c(d_{tr} - d_{ts}) + T_d - I_d + K_{L,r} - K_{L,s} + \lambda_L N_L + \lambda_L \omega + M_L + \epsilon_L
$$

where:
- \( \lambda_L \omega \): Wind-up due to circular polarization
- \( N_L \): Integer ambiguity
- \( K_{L,r}, K_{L,s} \): Carrier phase instrumental delays
- \( M_L \): Carrier phase multipath
- \( \epsilon_L \): Noise

### Doppler Shift

The receiver must estimate the Doppler shift of each received signal in order to be able to receive it.
The Doppler shift of a given signal is the time derivative of its carrier phase. As such, the Doppler shift is
primarily determined by the relative velocity of the satellite's and receiver's antennas, plus a common
offset that is proportional to the receiver's clock frequency error.

## 05 Positioning Modes

### GPS Point Positioning (Autonomous) 
- Used mainly when relatively low accuracy is required. This includes recreation applications and low accuracy navigation.

- GPS point positioning, also known as standalone or autonomous positioning, involves only one GPS receiver.
- This means that only one receiver simultaneously tracks four or more GPS satellites to determine its own coordinates with respect to the center of the Earth.
- To determine the receiver’s position at any time, the satellite coordinates as well as a minimum of four ranges to four satellites are required.
- The receiver gets the satellite coordinates through the navigation message, while ranges are obtained from either the C/A code or P-code, depending on the receiver type (civilian or military).
- This brings the total number of unknown parameters to four: three for receiver coordinates and one for the receiver clock error.
- This is the reason why at least four satellites are needed. If more than four satellites are tracked, the so-called least squares estimation is applied.
- As the satellite coordinates are given in the WGS-84 system, the obtained receiver coordinates will be in the WGS-84 system as well. These are then transformed to the local coordinate system through transformation parameters.

### GPS Relative Positioning (Differential, Kinematic, and Static)

GPS Relative Positioning:
► GPS relative positioning, also called differential positioning, employs at least two GPS receivers
simultaneously tracking the same satellites to determine their relative coordinates.
► Of the two receivers, one selected as a reference or base, which remains stationary at a site with
precisely known coordinates. The other receiver known as Rover or Remote receiver has its coordinate
unknown. The rover receiver may or may not be stationary depending upon the type of GPS operation.
► Carrier phase or pseudo range measurements can be used in relative positioning.
► GPS relative positioning provides a higher accuracy than that of autonomous positioning.
► Depending on whether the carrier phase or the pseudo range measurements used in relative
positioning, an accuracy level of a sub centimeter to a few meters can obtained.
This is mainly because the measurements of two or more receivers simultaneously tracking a particular
satellite contain more or less the same errors and biases.
- Employs at least two GPS receivers simultaneously tracking the same satellites. Can be made either in real time or post mission modes. GPS relative 

## 06 Error and Bias Terms

- Related to Satellite
  - Satellite Clock
  - Ephemeris
- Related to Receiver
  - Measurement Noise
  - Receiver Clock
- Related to Environment (propagation)
  - Troposphere Refraction
  - Ionosphere Refraction: delay PR (group velocity) and advance CP (phase velocity)
  - Multipath

## 07 Positioning with Pseudorange & Carrier Phase

## Dilution of Precision (DOP)

| DOP Value | Ratings |
|-----------|---------|
| 1         | Ideal   |
| 1-2       | Excellent |
| 2-5       | Good    |
| 5-10      | Moderate |
| 10-20     | Fair    |
| 20-50     | Poor    |
| >50       | Very Poor |
