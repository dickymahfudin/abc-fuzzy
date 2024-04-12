variable

1. Persentase ABC
   Himpunan "rendah" dengan rentang 0 - 3
   Himpunan "sedang" dengan rentang 2 - 5
   Himpunan "tinggi" dengan rentang 4 - 7
2. Persediaan (Stock):
   Himpunan "sedikit" dengan rentang 0 - 30
   Himpunan "cukup" dengan rentang 20 - 60
   Himpunan "banyak" dengan rentang 40 - 100

variable output
Jumlah Pembeliaan
Himpunan "sedikit" dengan rentang 0 - 75
Himpunan "cukup" dengan rentang 70 - 145
Himpunan "banyak" dengan rentang 140 - 210

aturan fuzzy
IF Persentase ABC rendah DAN Persediaan sedikit THEN Jumlah Pembelian sedikit.
IF Persentase ABC rendah DAN Persediaan cukup THEN Jumlah Pembelian sedikit.
IF Persentase ABC rendah DAN Persediaan banyak THEN Jumlah Pembelian sedikit.
IF Persentase ABC sedang DAN Persediaan sedikit THEN Jumlah Pembelian banyak.
IF Persentase ABC sedang DAN Persediaan cukup THEN Jumlah Pembelian cukup.
IF Persentase ABC sedang DAN Persediaan banyak THEN Jumlah Pembelian sedikit.
IF Persentase ABC tinggi DAN Persediaan sedikit THEN Jumlah Pembelian banyak.
IF Persentase ABC tinggi DAN Persediaan cukup THEN Jumlah Pembelian cukup.
IF Persentase ABC tinggi DAN Persediaan banyak THEN Jumlah Pembelian sedikit.

L M N O P Q R S T
R1 R2 R3 R4 R5 R6 R7 R8 R9

=MAX(L3;M3;N3;Q3;T3)
=MAX(P3;S3)
=MAX(O3;R3)

banyak. O

banyak. R

=IF(Perhitungan!F3>=$B$7; 0; IF(AND(Perhitungan!F3>=$A$7; Perhitungan!F3<=$B$7); ($B$7-Perhitungan!F3)/($B$7-$A$7); IF(Perhitungan!F3<=$A$7; 1; 0)))
=IF(AND(Perhitungan!F3>=$A$7; Perhitungan!F3<=$B$7); (Perhitungan!F3-$A$7)/($B$7-$A$7); IF(AND(Perhitungan!F3>=$B$7; Perhitungan!F3<=$C$7); ($C$7-Perhitungan!F3)/($C$7-$B$7); 0))
=IF(AND(Perhitungan!F3>=$B$7; Perhitungan!F3<=$C$7); (Perhitungan!F3-$B$7)/($C$7-$B$7); IF(Perhitungan!F3<=$B$7; 0; 1))


=()
(L3*$A$11 +M3*$A$11 +N3*$A$11 +O3*$C$11 +P3*$B$11 +Q3*$A$11 +R3*$C$11 +S3*$B$11 +T3*$A$11) + (L3 + M3 + N3 + O3 + P3 + Q3 + R3 + S3 + T3)

 