from flask import Flask,render_template,request
import serial
import time
import threading
import serial.tools.list_ports

distance = 0.0
battPower = 0.0
voltage = 0.0
current = 0.0
wattHr = 0.0
speed = 0.0
battCapacity = 0

isConnected = False
startGetValue = False
comport = ""

app = Flask(__name__)

@app.route('/')
def hello():
	return render_template("template.html")

@app.route('/init')
def initStatus():
	global isConnected,comport
	status = "%s,%d,%s"%(isConnected,distance,comport)
	return status

@app.route('/toggleConnect')
def toggle():

	global isConnected,s,t,comport

	comport = str(request.args.get('comport'))
	print (comport)

	if not isConnected and comport != "" :
		try:
			s = serial.Serial(port=comport, baudrate=9600)
			isConnected = True
			t = threading.Thread(target=getvalue, args=(1,))
			t.start()
			print("Thread Started...")
		except Exception as e:
			isConnected = False
			print(e)

	elif isConnected:
		isConnected = False
		if s.is_open: s.close()
		if t.is_alive():    startGetValue = False

	# print ("Connection status="+str(isConnected))
	return str(isConnected)

@app.route('/getComList')
def getComList():
	connectedHTML = [""]
	htmlContent = '<option value="%s">%s</option>'
	htmlresponse = ""
	comlist = serial.tools.list_ports.comports()
	for n,element in enumerate(comlist):
		dev = element.device
		htmlresponse += htmlContent%(dev,dev)
		connectedHTML.append(dev)
		# print("%d. %s"%(n+1,str(dev)))
	return htmlresponse

@app.route('/setValue')
def setValue():
	global distance
	global battPower
	global voltage
	global current
	global wattHr
	global speed
	global battCapacity

	distance = request.args.get('distance')
	speed = request.args.get('speed')
	battPower = request.args.get('battpower')
	voltage = request.args.get('voltage')
	current = request.args.get('current')
	wattHr = request.args.get('watthr')
	battCapacity = request.args.get('battcapacity')
	# print(speed)
	return (str(isConnected))

def getvalue(i):
	global startGetValue,s,distance
	global battPower
	global voltage
	global current
	global wattHr
	global speed
	global battCapacity

	startGetValue = True
	while(startGetValue):
		val = "EXT&&DIS"+str(distance)+"&"\
		+"BTP"+str(battPower)+"&"\
		+"BTV"+str(voltage)+"&"\
		+"BTA"+str(current)+"&"\
		+"WHR"+str(wattHr)+"&"\
		+"SPD"+str(speed)+"&"\
		+"BTC"+str(battCapacity)\
		+"??\r\n"
		# print(val)
		s.write(val.encode("utf-8"))
		time.sleep(5)

if __name__ == '__main__':
	app.run(port=82,debug=True)