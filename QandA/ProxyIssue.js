////proxy issue solutions, just for Chinese users
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
/* 
1.commen question for Chinese user. If you plan to use GEE in python
Jupyter, you might encounter the issue of connect overtime. The currently
effective solution is to change your vpn. I suggest you to choose
astrill and turn to stealvpn mode. Several users succeed as the above method.
You are advised to look at below link:
https://groups.google.com/g/google-earth-engine-developers/c/GeO3d6Utyto

2.When you conduct ee.autheticate, winerror 10060 might be return. 
It was caused by failed connection to GEE server. The reason is your code in jupyter does not go by your VPN, 
so you need to explicitlly appoint it in jupyter before authenticating GEE. 
Two solutions are raised as below: 
1. set your VPN in global pattern 
2. Force your jupyter to run your VPN separately.
{import os
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:port'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:port'}
Note that the port in different VPN is different (e.g. SSR :1080、V2rayN:10809、saifeng and landeng need to configure by your self).
*/

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
