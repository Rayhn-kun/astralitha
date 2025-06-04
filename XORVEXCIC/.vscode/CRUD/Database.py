def init_console():
  try:
    with open("data.txt", "r") as file:
      print("Database tersedia, init done")
  except:
    print("Database tidak ditemukan, silahkan membuat data base baru")
    with open("data.txt","w",encoding="utf-8") as file:
      penulis =input("Penulis :")
      judul =input("judul :")
      tahun =input("tahun :")