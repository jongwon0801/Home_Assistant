#!/bin/bash
source /home/pi/.virtualenvs/elcsoft/bin/activate
python /home/pi/www/Eco/updateEcoData.py >> /home/pi/www/Eco/cron.log 2>&1

