# ALS Assistive Tech Device
This is the official readme for the ALS Assistive Tech Device project, it contains all information regarding the overall functionality and design of the system, as well as instructions for construction and use of the system.

# Introduction
This project is a design for a device to assist communication and provide access 

# Purpose and Goals
## Purpose
The purpose of this assistive technology device is to empower individuals living with Amyotrophic Lateral Sclerosis (ALS) by providing them with an innovative tool to overcome communication barriers and gain greater control over their immediate environment. Recognizing the unique challenges faced by ALS patients, this device is meticulously designed to facilitate easy and effective interaction, even with limited physical mobility.

## Goals
### Enhanced Communication:

To offer a reliable text-to-speech functionality that allows ALS patients to communicate their thoughts and needs verbally, using minimal finger movements.

To ensure that the text-to-speech process is intuitive, quick, and requires minimal effort, catering to the specific needs of individuals with varying degrees of motor skills.

### Environmental Control:

To provide the capability to control electronic devices such as televisions and room outlets, enabling users to maintain autonomy over their living space.

To design a user interface that is simple to navigate, ensuring that switching between different controls (e.g., TV, lights, and other appliances) is seamless and requires minimal physical exertion.

### Customization and Accessibility:

To include customization options that allow the device to be tailored to individual preferences and requirements, ensuring maximum comfort and usability.

To ensure that the device is accessible, taking into account the diverse range of abilities and challenges faced by ALS patients.
Technical Reliability and Safety:

To ensure the device's technical reliability, providing consistent performance without frequent maintenance.

To adhere to the highest safety standards, minimizing any risks associated with the use of the device.

### Empowerment and Independence:

To empower ALS patients by providing a tool that enhances their ability to interact with others and control their environment, thereby improving their quality of life.

To promote independence and dignity for ALS patients, offering them a means to express themselves and manage their surroundings without constant reliance on caregivers.

# Features
Our assistive technology device is designed to empower users with a range of functionalities, tailored for ease of use and accessibility. Here are its key features:
## Simple User Interface: 
The device boasts a user-friendly interface, enabling easy navigation suited for users who rely on a single selector input device, ensuring that interaction with the device is straightforward and intuitive.
## Text-to-Speech Functionality:
### Quick Phrases: 
Users can access pre-programmed phrases for common needs or expressions, facilitating rapid communication.
Custom Phrase Keyboard: A built-in keyboard allows for the creation of custom phrases, catering to unique communication requirements.
### Text Prediction: 
To speed up typing and enhance convenience, the device features intelligent text prediction.
## TV Control via IR Transmitter: 
The device includes an infrared (IR) transmitter, empowering users to control their television sets remotely. This feature adds an element of autonomy in entertainment and daily living.
## Wireless Outlet Control: 
Equipped with an RF transmitter, the device can wirelessly toggle power outlets on and off. This functionality enhances the user's ability to interact with their environment effortlessly.
## Music Player: 
For entertainment and relaxation, the device incorporates a music player. This feature is designed to be easily operable, providing users with leisure and therapeutic benefits.
## Customization Options: 
Understanding that each user's needs and preferences are unique, our device offers various customization settings. These adjustments allow for a more personalized experience, enhancing comfort and usability.
# Technology Stack
![image](https://github.com/ianschae/ALS-Assistive-Tech/assets/45367686/fca962b6-da2e-45aa-8d26-86e67cf13f10)
## Front End 
HTML/CSS -> Javascript

## Back End
Python (eel)

# Installation and Setup
This section covers the necessary steps to get the assistive technology device operational on your system.

## Prerequisites
Ensure you have Python installed on your system, as this project is Python-based. You can download Python from python.org.
## Libraries
|Library | Links| Notes |
|---------|------|-------|
|   eel   | [Documentation](https://github.com/python-eel/Eel)| For Interaction between Python Backend and JS Frontend |
|pyautogui|[Documentation](https://pyautogui.readthedocs.io/en/latest/)| For automated Mouse Control |
|  rpi_rf | [Documentation](https://github.com/milaq/rpi-rf) | For transmission of rf signals |
|  vlc    | [Documentation](https://www.olivieraubert.net/vlc/python-ctypes/doc/) | For music player |
|  gtts   | [Documentation](https://gtts.readthedocs.io/en/latest/) | For text-to-speech |
|   os    | [Documentation](https://docs.python.org/3/library/os.html) | For OS interfacing |
|  json   | [Documentation](https://docs.python.org/3/library/json.html) | For encoding and decoding Jsons with python |
| pyserial| [Documentation](https://pyserial.readthedocs.io/en/latest/) | For communication with the Arduino |


To install these libraries, run the following command in your terminal:

pip install eel pyautogui rpi_rf python-vlc gTTS os json pyserial

Some libraries like rpi_rf and python-vlc may have additional dependencies or steps for installation. Refer to the linked documentation for each library for detailed instructions.

## Setting Up the Hardware
### IR Transmitter:
Connect the IR transmitter to the designated GPIO pins on your Raspberry Pi.
Ensure rpi_rf is configured to use the correct pins in the code.
### RF Transmitter:
Attach the RF transmitter to the Raspberry Pi's GPIO pins.
Verify that the rpi_rf module is correctly set up to communicate with the transmitter.
### Arduino:
Connect the Arduino to the Raspberry Pi via USB.
Load the provided Arduino sketch to manage the device's inputs and outputs.
Configuration
### Device Settings:
Modify the config.json file to set up your device's preferences and initialize the system settings.
# Customization:
You can customize the quick phrases and other features by editing the respective configuration files in the project directory.
### Running the Application
To launch the application, navigate to the project's directory in your terminal and run:

python3 main.py

## 
