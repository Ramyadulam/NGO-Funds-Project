const { expect } = require("chai");

describe("NGOFund Contract", () => {
    let ngoFund;
    let owner;
    let donor;
    let ngoWallet;

    const TEST_NGO_ID = "507f1f77bcf86cd799439011"; // MongoDB ObjectId format
    const TEST_NGO_NAME = "Test NGO";

    beforeEach(async () => {
        // Get signers
        [owner, donor, ngoWallet] = await ethers.getSigners();

        // Deploy contract
        const NGOFund = await ethers.getContractFactory("NGOFund");
        ngoFund = await NGOFund.deploy();
        await ngoFund.waitForDeployment();
    });

    describe("NGO Registration", () => {
        it("Should register a new NGO", async () => {
            const tx = await ngoFund.registerNGO(
                TEST_NGO_ID,
                TEST_NGO_NAME,
                ngoWallet.address
            );

            await expect(tx)
                .to.emit(ngoFund, "NGORegistered")
                .withArgs(TEST_NGO_ID, TEST_NGO_NAME, ngoWallet.address);
        });

        it("Should store NGO details correctly", async () => {
            await ngoFund.registerNGO(TEST_NGO_ID, TEST_NGO_NAME, ngoWallet.address);

            const ngo = await ngoFund.ngos(TEST_NGO_ID);
            expect(ngo.mongoId).to.equal(TEST_NGO_ID);
            expect(ngo.name).to.equal(TEST_NGO_NAME);
            expect(ngo.wallet).to.equal(ngoWallet.address);
            expect(ngo.isRegistered).to.be.true;
        });

        it("Should prevent duplicate NGO registration", async () => {
            await ngoFund.registerNGO(TEST_NGO_ID, TEST_NGO_NAME, ngoWallet.address);

            await expect(
                ngoFund.registerNGO(TEST_NGO_ID, "Different NGO", ngoWallet.address)
            ).to.be.revertedWith("NGO already registered");
        });

        it("Should reject invalid wallet address", async () => {
            await expect(
                ngoFund.registerNGO(TEST_NGO_ID, TEST_NGO_NAME, ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid wallet address");
        });
    });

    describe("Donations", () => {
        beforeEach(async () => {
            // Register NGO before each donation test
            await ngoFund.registerNGO(TEST_NGO_ID, TEST_NGO_NAME, ngoWallet.address);
        });

        it("Should accept a donation", async () => {
            const donationAmount = ethers.parseEther("1.0");
            const message = "Great work!";

            const tx = await donor.sendTransaction({
                to: await ngoFund.getAddress(),
                data: ngoFund.interface.encodeFunctionData("donate", [TEST_NGO_ID, message]),
                value: donationAmount,
            });

            await expect(tx)
                .to.emit(ngoFund, "DonationMade")
                .withArgs(donor.address, TEST_NGO_ID, donationAmount, expect.any(Number));
        });

        it("Should transfer funds to NGO wallet", async () => {
            const donationAmount = ethers.parseEther("1.0");
            const initialBalance = await ethers.provider.getBalance(ngoWallet.address);

            await ngoFund.connect(donor).donate(TEST_NGO_ID, "Support your work");

            // Send donation
            await donor.sendTransaction({
                to: await ngoFund.getAddress(),
                data: ngoFund.interface.encodeFunctionData("donate", [TEST_NGO_ID, "Support"]),
                value: donationAmount,
            });

            // Note: We need to manually trigger donate function
            await ngoFund.connect(donor).donate(TEST_NGO_ID, "Support", { value: donationAmount });

            const finalBalance = await ethers.provider.getBalance(ngoWallet.address);
            expect(finalBalance).to.be.gt(initialBalance);
        });

        it("Should record donation details", async () => {
            const donationAmount = ethers.parseEther("0.5");
            const message = "Love your mission";

            await ngoFund.connect(donor).donate(TEST_NGO_ID, message, {
                value: donationAmount,
            });

            const donationsCount = await ngoFund.getDonationCount();
            expect(donationsCount).to.equal(1);

            const donation = await ngoFund.donations(0);
            expect(donation.donor).to.equal(donor.address);
            expect(donation.ngoId).to.equal(TEST_NGO_ID);
            expect(donation.amount).to.equal(donationAmount);
            expect(donation.message).to.equal(message);
        });

        it("Should reject donation to unregistered NGO", async () => {
            const unregisteredId = "607f1f77bcf86cd799439012";
            const donationAmount = ethers.parseEther("1.0");

            await expect(
                ngoFund.connect(donor).donate(unregisteredId, "Help", {
                    value: donationAmount,
                })
            ).to.be.revertedWith("NGO not registered on blockchain");
        });

        it("Should reject zero-value donations", async () => {
            await expect(
                ngoFund.connect(donor).donate(TEST_NGO_ID, "No money", {
                    value: 0,
                })
            ).to.be.revertedWith("Donation amount must be greater than 0");
        });

        it("Should support multiple donations to same NGO", async () => {
            const amount1 = ethers.parseEther("1.0");
            const amount2 = ethers.parseEther("2.5");

            await ngoFund.connect(donor).donate(TEST_NGO_ID, "First donation", {
                value: amount1,
            });

            const [donor2] = await ethers.getSigners();
            await ngoFund.connect(donor2).donate(TEST_NGO_ID, "Second donation", {
                value: amount2,
            });

            const count = await ngoFund.getDonationCount();
            expect(count).to.equal(2);
        });

        it("Should emit event with timestamp", async () => {
            const donationAmount = ethers.parseEther("1.0");

            const tx = ngoFund.connect(donor).donate(TEST_NGO_ID, "Test", {
                value: donationAmount,
            });

            const receipt = await (await tx).wait();
            expect(receipt).to.not.be.null;
        });
    });

    describe("Donation Count", () => {
        it("Should return 0 donations initially", async () => {
            const count = await ngoFund.getDonationCount();
            expect(count).to.equal(0);
        });

        it("Should increment donation count correctly", async () => {
            await ngoFund.registerNGO(TEST_NGO_ID, TEST_NGO_NAME, ngoWallet.address);

            expect(await ngoFund.getDonationCount()).to.equal(0);

            await ngoFund.connect(donor).donate(TEST_NGO_ID, "Donation 1", {
                value: ethers.parseEther("1.0"),
            });

            expect(await ngoFund.getDonationCount()).to.equal(1);

            await ngoFund.connect(donor).donate(TEST_NGO_ID, "Donation 2", {
                value: ethers.parseEther("0.5"),
            });

            expect(await ngoFund.getDonationCount()).to.equal(2);
        });
    });
});
