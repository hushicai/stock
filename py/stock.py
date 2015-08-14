import tushare as ts

code = '600036'

df = ts.get_hist_data(code)

# print df.to_json();

df.to_json('example/' + code + '/input.json', orient = 'index')
