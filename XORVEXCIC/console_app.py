# Python Console Application: Manajer Karakter 3D Anime

import json
import os

DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'characters.json')

def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def tampilkan_semua_karakter():
    karakter_list = load_data()
    if not karakter_list:
        print("Belum ada data karakter.")
    else:
        print("\nDaftar Karakter 3D Anime:")
        print("-" * 40)
        for idx, karakter in enumerate(karakter_list, start=1):
            print(f"{idx}. Nama Karakter     : {karakter['Nama karakter']}")
            print(f"   Asal Anime       : {karakter['Asal anime']}")
            print(f"   Software         : {karakter['Software yang digunakan']}")
            print(f"   File Model       : {karakter['Nama file model']}")
            print(f"   Status Rigging   : {karakter['Status rigging']}")
            print("-" * 40)

def tambah_karakter():
    karakter_list = load_data()
    print("\nMasukkan detail karakter baru:")
    nama = input("Nama karakter: ")
    asal = input("Asal anime: ")
    software = input("Software yang digunakan (contoh: VRoid, Blender, dsb.): ")
    file_model = input("Nama file model (.vrm/.fbx): ")
    while True:
        status = input("Status rigging (Belum/Proses/Selesai): ")
        if status in ["Belum", "Proses", "Selesai"]:
            break
        print("Masukkan status yang valid (Belum, Proses, atau Selesai).")
    karakter_baru = {
        "Nama karakter": nama,
        "Asal anime": asal,
        "Software yang digunakan": software,
        "Nama file model": file_model,
        "Status rigging": status
    }
    karakter_list.append(karakter_baru)
    save_data(karakter_list)
    print(f"Karakter '{nama}' berhasil ditambahkan.")

def ubah_karakter():
    karakter_list = load_data()
    if not karakter_list:
        print("Belum ada data karakter yang bisa diubah.")
        return
    tampilkan_semua_karakter()
    try:
        nomor = int(input("Masukkan nomor karakter yang akan diubah: "))
        if 1 <= nomor <= len(karakter_list):
            index = nomor - 1
            karakter = karakter_list[index]
            print("Masukkan data baru (kosongkan jika tidak ingin mengubah):")
            nama_baru = input(f"Nama karakter [{karakter['Nama karakter']}]: ")
            if nama_baru:
                karakter['Nama karakter'] = nama_baru
            asal_baru = input(f"Asal anime [{karakter['Asal anime']}]: ")
            if asal_baru:
                karakter['Asal anime'] = asal_baru
            software_baru = input(f"Software yang digunakan [{karakter['Software yang digunakan']}]: ")
            if software_baru:
                karakter['Software yang digunakan'] = software_baru
            file_baru = input(f"Nama file model [{karakter['Nama file model']}]: ")
            if file_baru:
                karakter['Nama file model'] = file_baru
            status_baru = input(f"Status rigging [{karakter['Status rigging']}]: ")
            if status_baru:
                if status_baru in ["Belum", "Proses", "Selesai"]:
                    karakter['Status rigging'] = status_baru
                else:
                    print("Status tidak valid. Tetap menggunakan nilai lama.")
            save_data(karakter_list)
            print("Data karakter berhasil diperbarui.")
        else:
            print("Nomor karakter tidak valid.")
    except ValueError:
        print("Input tidak valid, masukkan angka yang sesuai.")

def hapus_karakter():
    karakter_list = load_data()
    if not karakter_list:
        print("Belum ada data karakter yang bisa dihapus.")
        return
    tampilkan_semua_karakter()
    try:
        nomor = int(input("Masukkan nomor karakter yang akan dihapus: "))
        if 1 <= nomor <= len(karakter_list):
            konfirmasi = input("Apakah Anda yakin ingin menghapus karakter ini? (y/n): ")
            if konfirmasi.lower() == 'y':
                terhapus = karakter_list.pop(nomor - 1)
                save_data(karakter_list)
                print(f"Karakter '{terhapus['Nama karakter']}' berhasil dihapus.")
            else:
                print("Penghapusan karakter dibatalkan.")
        else:
            print("Nomor karakter tidak valid.")
    except ValueError:
        print("Input tidak valid, masukkan angka yang sesuai.")

def main():
    while True:
        print("\nManajer Karakter 3D Anime")
        print("1. Tampilkan semua karakter")
        print("2. Tambah karakter baru")
        print("3. Ubah data karakter")
        print("4. Hapus karakter")
        print("5. Keluar")
        pilihan = input("Pilih opsi (1-5): ")

        if pilihan == '1':
            tampilkan_semua_karakter()
        elif pilihan == '2':
            tambah_karakter()
        elif pilihan == '3':
            ubah_karakter()
        elif pilihan == '4':
            hapus_karakter()
        elif pilihan == '5':
            print("Keluar dari aplikasi.")
            break
        else:
            print("Opsi tidak valid, silakan pilih nomor 1-5.")

if __name__ == "__main__":
    main()
