import { TypedFastBitSet } from "./TypedFastBitSet";

describe("TypedFastBitSet toBytes() method", () => {
  it("should return an empty byte array for an empty bitset", () => {
    const b = new TypedFastBitSet();
    const bytes = b.toBytes();
    expect(bytes.length).toBe(0);
  });

  it("should correctly serialize a bitset with small set bits", () => {
    const b = new TypedFastBitSet([0, 1, 2]);
    const bytes = b.toBytes();
    expect(bytes.length).toBe(1); // only need 1 byte
    // bits 0,1,2 => 0x07 => 111 in binary
    expect(bytes[0]).toBe(0x07);
  });

  it("should serialize correctly if max set bit is large", () => {
    // mass of random bits, but the largest is 31
    const b = new TypedFastBitSet([0, 2, 5, 31]);
    const bytes = b.toBytes();
    expect(bytes.length).toBe(4);
    // bit 31 => the 31 // 8 == 3rd byte, offset 7
    // So the 4th byte (index 3) should be: 10000000 = 0x80
    expect(bytes[3]).toBe(0x80);
    // Also bits 0,2,5 => first byte
    // bit 0 => 00000001 => 0x01
    // bit 2 => 00000100 => 0x04
    // bit 5 => 00100000 => 0x20
    // Combine => 0x25 (00100101)
    expect(bytes[0]).toBe(0x25);
  });

  it("should round-trip via toBytes() and fromBytes()", () => {
    const originalSet = new TypedFastBitSet([0, 3, 7, 9, 15, 16, 30, 31, 63]);
    const bytes = originalSet.toBytes();
    const reconstructed = TypedFastBitSet.fromBytes(bytes);
    // They should contain exactly the same elements
    expect(reconstructed.size()).toBe(originalSet.size());
    expect(reconstructed.array()).toEqual(originalSet.array());
  });

  it("should deserialize empty array to empty bitset", () => {
    const bytes = new Uint8Array(0);
    const reconstructed = TypedFastBitSet.fromBytes(bytes);
    expect(reconstructed.size()).toBe(0);
    expect(reconstructed.array().length).toBe(0);
  });

  it("should convert to base64 string correctly", () => {
    const b = new TypedFastBitSet([0, 1, 2, 10, 15]);
    const base64String = b.toBase64String();
    // Recalculated base64 string for the given set bits
    const expectedBase64 = "B4Q="; // Adjusted based on actual bitset
    expect(base64String).toBe(expectedBase64);
  });

  it("should handle empty byte array for base64 conversion", () => {
    const base64String = new TypedFastBitSet().toBase64String();
    expect(base64String).toBe('');
  });

  it("should convert from base64 string correctly", () => {
    const base64String = "B4Q=";
    const bitset = TypedFastBitSet.fromBase64String(base64String);
    const expectedSet = new TypedFastBitSet([0, 1, 2, 10, 15]);
    expect(bitset.size()).toBe(expectedSet.size());
    expect(bitset.array()).toEqual(expectedSet.array());
  });

  it("should handle empty base64 string conversion", () => {
    const base64String = "";
    const bitset = TypedFastBitSet.fromBase64String(base64String);
    expect(bitset.size()).toBe(0);
    expect(bitset.array().length).toBe(0);
  });
}); 