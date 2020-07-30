# -*- coding: utf-8 -*-

# Imports --------------------------------------------------------------------

import json
import numpy as np
import pandas as pd

# Functions ------------------------------------------------------------------

def merge_names_with_polygons(names_in='msoa-names.csv',
    polygons_in='msoa-2011-polygons-ons.json',
    polygons_out='msoa-2011-polygons-hcl.json'):

    names = pd.read_csv(names_in)

    with open(polygons_in, 'r') as polygons_in_json:

        polygons = json.load(polygons_in_json)

        for feature in polygons['features']:

            if 'objectid' in feature['properties']:
                del(feature['properties']['objectid'])

            if 'st_areasha' in feature['properties']:
                del(feature['properties']['st_areasha'])

            if 'st_lengths' in feature['properties']:
                del(feature['properties']['st_lengths'])

            code = feature['properties']['msoa11cd']
            name_data = names[names['msoa11cd'] == code]
            english_name = name_data['msoa11hclnm'].item()
            welsh_name = name_data['msoa11hclnmw'].item()
            name = ''

            if pd.isnull(welsh_name):
                name = english_name
            else:
                if english_name.strip() == welsh_name.strip():
                    name = english_name
                else:
                    name = '{0} / {1}'.format(welsh_name, english_name)

            feature['properties']['msoa11hclnm'] = name

    with open(polygons_out, 'w') as polygons_out_json:
        json.dump(polygons, polygons_out_json, separators=(',', ':'))


def merge_names_with_points(names_in='msoa-names.csv',
    points_in='msoa-2011-centroids-ons.json',
    points_out='msoa-2011-centroids-hcl.json',
    coordinates_out='coordinates.csv'):

    csv_codes = []
    csv_names = []
    csv_longs = []
    csv_lats = []

    names = pd.read_csv(names_in)

    with open(points_in, 'r') as points_in_json:

        points = json.load(points_in_json)

        for feature in points['features']:

            if 'objectid' in feature['properties']:
                del(feature['properties']['objectid'])

            code = feature['properties']['msoa11cd']
            name_data = names[names['msoa11cd'] == code]
            english_name = name_data['msoa11hclnm'].item()
            welsh_name = name_data['msoa11hclnmw'].item()
            name = ''

            if pd.isnull(welsh_name):
                name = english_name
            else:
                if english_name.strip() == welsh_name.strip():
                    name = english_name
                else:
                    name = '{0} / {1}'.format(welsh_name, english_name)

            feature['properties']['msoa11hclnm'] = name

            csv_codes.append(code)
            csv_names.append(name)
            csv_longs.append(feature['geometry']['coordinates'][0])
            csv_lats.append(feature['geometry']['coordinates'][1])

    with open(points_out, 'w') as points_out_json:
        json.dump(points, points_out_json, separators=(',', ':'))

    csv_df = pd.DataFrame({
        'codes': csv_codes,
        'names': csv_names,
        'longs': csv_longs,
        'lats': csv_lats
    })

    csv_df.to_csv(coordinates_out)
