
#!/bin/bash
# Installation script for Raspberry Pi DHT11 sensor dependencies

echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y python3-pip python3-dev build-essential

echo "Installing Python packages..."
pip3 install -r requirements.txt

echo "Setting up GPIO permissions..."
sudo usermod -a -G gpio $USER

echo "Installation complete!"
echo "You may need to reboot for GPIO permissions to take effect."
echo ""
echo "To run the sensor logger:"
echo "python3 raspberry_pi_sensor.py"
