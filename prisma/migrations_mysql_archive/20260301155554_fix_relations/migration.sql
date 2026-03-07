-- AddForeignKey
ALTER TABLE `ProsesMaterial` ADD CONSTRAINT `ProsesMaterial_prosesId_fkey` FOREIGN KEY (`prosesId`) REFERENCES `Proses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
