ffmpeg -i "./input/video/GlaucalFun_01_haut-parleurs.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/01-hauts-parleurs.webm"
ffmpeg -i "./input/video/GlaucalFun_02_ça-tourne8fps.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/02-ca-tourne8fps.webm"
ffmpeg -i "./input/video/GlaucalFun_03_cymbale.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/03-cymbale.webm"
ffmpeg -i "./input/video/GlaucalFun_04_plante.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/04-plante.webm"
ffmpeg -i "./input/video/GlaucalFun_05_helices.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/05-helices.webm"
ffmpeg -i "./input/video/GlaucalFun_06_cadre-photo.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/06-cadre-photo.webm"
ffmpeg -i "./input/video/GlaucalFun_07_réparer-la-machine.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/07-réparer-la-machine.webm"
ffmpeg -i "./input/video/GlaucalFun_08_chercher-vinyle.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/08-chercher-vinyle.webm"
ffmpeg -i "./input/video/GlaucalFun_09_lecture.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/09-lecture.webm"
ffmpeg -i "./input/video/GlaucalFun_10_fleur-a-vent.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/10-fleur-a-vent.webm"
ffmpeg -i "./input/video/GlaucalFun_11_tourner-sur-tabouret.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/11-tourner-sur-tabouret.webm"
ffmpeg -i "./input/video/GlaucalFun_12_ou-va-le-cable.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/12-ou-va-le-cable.webm"
ffmpeg -i "./input/video/GlaucalFun_13_tous-les-boutons.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/13-tous-les-boutons.webm"
ffmpeg -i "./input/video/GlaucalFun_14_climatisation.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/14-climatisation.webm"
ffmpeg -i "./input/video/GlaucalFun_15_lampe.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/15-lampe.webm"
ffmpeg -i "./input/video/GlaucalFun_16_bricolage.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/16-bricolage.webm"
ffmpeg -i "./input/video/GlaucalFun_17_trier-les-vis.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/17-trier-les-vis.webm"
ffmpeg -i "./input/video/GlaucalFun_18_cafetière.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/18-cafetiere.webm"
ffmpeg -i "./input/video/GlaucalFun_19_machines-musique.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/19-machines-musique.webm"
ffmpeg -i "./input/video/GlaucalFun_20_couché-par-terre.mov" -c:v libvpx-vp9 -b:v 1M -crf 30 -profile:v 0 -pix_fmt yuv420p -an -f webm "./output/20-couché-par-terre.webm"

ffmpeg -i "./input/audio/01. La garderie d_art.wav" -acodec mp3 ./output/01-la-garderie-d-art.mp3
ffmpeg -i "./input/audio/02. Ça tourne.wav" -acodec mp3 ./output/02-ca-tourne.mp3
ffmpeg -i "./input/audio/03. Marins Schtroumpfs.wav" -acodec mp3 ./output/03-marins-schtroumpfs.mp3
ffmpeg -i "./input/audio/04. Market Tango.wav" -acodec mp3 ./output/04-market-tango.mp3
ffmpeg -i "./input/audio/05. St-Mérité les chênes (pt.1).wav" -acodec mp3 ./output/05-st-merite-les-chenes-pt1.mp3
ffmpeg -i "./input/audio/06. St-Mérité les chênes (pt.2) (Hommage aux cinq pachydermes).wav" -acodec mp3 ./output/06-st-merite-les-chenes-pt2.mp3
ffmpeg -i "./input/audio/07. Patadorf.wav" -acodec mp3 ./output/07-patadorf.mp3
ffmpeg -i "./input/audio/08. Buddah.com.wav" -acodec mp3 ./output/08-buddah-com.mp3
ffmpeg -i "./input/audio/09. Alice & Marius.wav" -acodec mp3 ./output/09-alice-marius.mp3
ffmpeg -i "./input/audio/10. Elephant_sadness.wav" -acodec mp3 ./output/10-elephant-sadness.mp3
ffmpeg -i "./input/audio/11. Thérapie de groupe.wav" -acodec mp3 ./output/11-therape-de-groupe.mp3
ffmpeg -i "./input/audio/12. Le jambon c_est si bon.wav" -acodec mp3 ./output/12-le-jambon-c-est-si-bon.mp3
ffmpeg -i "./input/audio/13. Attack of the cows.wav" -acodec mp3 ./output/13-attack-of-the-cows.mp3
ffmpeg -i "./input/audio/14. À nos beurgueurs.wav" -acodec mp3 ./output/14-a-nos-beurgueurs.mp3
ffmpeg -i "./input/audio/15. Gustavo Del_Totche.wav" -acodec mp3 ./output/15-gustavo-del-totche.mp3
ffmpeg -i "./input/audio/16. Coeur liquide.wav" -acodec mp3 ./output/16-coeur-liquide.mp3
ffmpeg -i "./input/audio/17. L_abonnement à la piscine.wav" -acodec mp3 ./output/17-l-abonnement-a-la-piscine.mp3
ffmpeg -i "./input/audio/18. Fum thon plastickk.wav" -acodec mp3 ./output/18-fum-thon-plastickk.mp3
ffmpeg -i "./input/audio/19. Roméo & Yvette.wav" -acodec mp3 ./output/19-romeo-yvette.mp3
ffmpeg -i "./input/audio/20. Rêverie pour tortellini n°1.wav" -acodec mp3 ./output/20-reverie-pour-tortellini-n1.mp3


