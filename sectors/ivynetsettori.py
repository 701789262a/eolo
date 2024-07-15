import queue
import threading
from operator import itemgetter
from queue import Queue, Full, Empty
import numpy as np
import datetime
import json
import math
import time

import requests
from pyproj import Transformer
import numpy
from numpy import (array, dot, arccos, clip)
from numpy.linalg import norm

import simplekml

def main():
    startfrom_excluded="Arcidosso"
    found=False
    transformer = Transformer.from_crs("EPSG:32632", "EPSG:4326")
    intcoord = Transformer.from_crs("EPSG:4326", "EPSG:32632") #trasformatore da corto a lungo
    bts_list = json.loads(open('ListaBTS_EOLO_ATTIVE_07-02-2024.json','r').read())
    for bts in bts_list:

        if bts['nome'] != startfrom_excluded and found==False:
            continue
        if bts['nome'] == startfrom_excluded:
            found=True


        target = bts['nome']
        bts_pos = intcoord.transform(float(bts['lat']),float(bts['lng'])  )# 32632 format

        kml = simplekml.Kml()

        headers = {
            'method': 'GET',
            'scheme': 'https',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,es;q=0.5,zh-CN;q=0.4,zh;q=0.3',
            'Referer': 'https://www.ivynet.it/copertura/raw',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'frontend_lang=it_IT; session_id=30571d878ebf088dc691db8b9603a4e57632cfaf'
        }


        square_size_side = 150
        big_square_side = 2500

        x = numpy.linspace(bts_pos[0] - big_square_side, bts_pos[0] + big_square_side,
                           int((big_square_side / square_size_side)))
        print(x)
        y = numpy.linspace(bts_pos[1] - big_square_side, bts_pos[1] + big_square_side,
                           int((big_square_side / square_size_side)))
        print(y)
        points = []

        for xs in x:
            for ys in y:
                points.append([xs, ys])
        print(len(points), points)


        cop = []
        q = Queue()
        r = Queue()
        index = 0
        thread = 5
        for i in range (thread):
            threading.Thread(target=threaded_func, args=(i,q,r,headers)).start()
        for point in points:
            point = transformer.transform(point[0], point[1])
            print(f"{index}, {point}")
            index +=1
            payload = (f'action=CoverRD&lat={point[0]}&lon={point[1]}&csrf_token=4ab884ef8172b292c334a9e5e09bae02852d4a10o', point[0],point[1])
            q.put(payload)
        while True:
            try:
                response=r.get(timeout=20,block=True)
            except Empty:
                break
            point = (response[1],response[2])
            response = response[0]
            if len(response) == 0:
                cop.append([point, 0])
                kml.newpoint(name="0", coords=[(point[1], point[0])])
                continue
            acq = False
            for bts in response:
                if bts['nome'] == target and "FWA-E" in bts['tecno']:
                    acq = True
                    print(f"-> Copertura ok tecnologia {bts['tecno']} @ {point} for {bts['nome']}")
                    cop.append([point, bts['tecno'].count('M')])
                    kml.newpoint(name=bts['tecno'].count('M'), coords=[(point[1], point[0])])
                    break
            if not acq:
                kml.newpoint(name="0", coords=[(point[1], point[0])])

        print(cop)
        kml.save(f'copertura_{target}.kml')

        coord_bts = transformer.transform(bts_pos[0], bts_pos[1])
        print(f"bts {coord_bts}")
        all_sector_dict =[]
        for speed in range(0,4):
            angles = []
            for point in cop:
                if point[1] != speed:
                    continue
                print(f"int {intcoord.transform(point[0][0], point[0][1])}")
                point_vector = intcoord.transform(point[0][0], point[0][1])
                vector = [point_vector[0] - bts_pos[0], point_vector[1] - bts_pos[1]]
                print(f"point {point}")
                print(f"vector {vector}")
                north_vector = [0,1]
                print(f"north vector {north_vector}")
                c = dot(vector, north_vector) / (np.sqrt(vector[0]**2 + vector[1]**2) * np.sqrt(north_vector[0]**2 + north_vector[1]**2))  # -> cosine of the angle
                print(f"cosine {c}")
                angle = (180/np.pi)*np.arccos(clip(c, -1, 1))
                print(f"angle {angle}")
                angles.append([point, angle if vector[0] >= 0 else 360-angle])
            sorted_list = sorted(angles, key=itemgetter(1))
            print(sorted_list)

            sector_dict = {}
            try:
                prev_angle = sorted_list[0][1]
            except IndexError:
                all_sector_dict.append({speed:{}})
                continue
            sector=0
            for angle in sorted_list[1:]:
                try:
                    sector_dict[sector]
                except KeyError:
                    sector_dict[sector]=[prev_angle ,0]
                if angle[1]-prev_angle <12:
                    sector_dict[sector][1]=angle[1] if angle[1] < 360 - 18 else 360
                else:
                    sector+=1
                prev_angle = angle[1]
            print(sector_dict)
            all_sector_dict.append({speed:sector_dict})
        open(f"{target}_sectors",'w').write(json.dumps(all_sector_dict))
        # Leggere CSV e applicare regole di filtro sulle righe (pacchetti) in base alla tabella data


def threaded_func (i,q,r,headers):
    while True:
        try:
            _payload = q.get(block=True,timeout = 5)
        except Empty:
            break
        response = requests.request("POST", "https://www.ivynet.it/copertura/raw", headers=headers, data=_payload[0]).text
        print(response)
        response = json.loads(response)
        print(f"thread {i}, resp {response}")
        r.put((response,_payload[1],_payload[2]))

if __name__ == "__main__":
    main()