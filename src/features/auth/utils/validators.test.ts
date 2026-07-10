import { describe, it, expect } from "vitest"
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
} from "./validators"

describe("validateUsername", () => {
  it("rechaza username vacío", () => {
    const result = validateUsername("")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Username is required")
  })

  it("rechaza username con menos de 3 caracteres", () => {
    const result = validateUsername("ab")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Username must be 3-20 characters")
  })

  it("rechaza username con más de 20 caracteres", () => {
    const result = validateUsername("a".repeat(21))
    expect(result.valid).toBe(false)
  })

  it("rechaza username con espacios", () => {
    const result = validateUsername("user name")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Username cannot contain spaces")
  })

  it("rechaza caracteres especiales no permitidos", () => {
    const result = validateUsername("user@name")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Only letters, numbers, _ or . allowed")
  })

  it("acepta caracteres válidos: letras, números, _ y .", () => {
    expect(validateUsername("user_name").valid).toBe(true)
    expect(validateUsername("user.name").valid).toBe(true)
    expect(validateUsername("User123").valid).toBe(true)
  })

  it("rechaza palabras reservadas", () => {
    expect(validateUsername("admin").valid).toBe(false)
    expect(validateUsername("root").valid).toBe(false)
    expect(validateUsername("ADMIN").valid).toBe(false)
  })
})

describe("validateEmail", () => {
  it("rechaza email vacío", () => {
    expect(validateEmail("").valid).toBe(false)
  })

  it("rechaza email con espacios", () => {
    expect(validateEmail("user @email.com").valid).toBe(false)
  })

  it("rechaza email con formato inválido", () => {
    expect(validateEmail("useremail.com").valid).toBe(false)
    expect(validateEmail("user@").valid).toBe(false)
    expect(validateEmail("@email.com").valid).toBe(false)
  })

  it("acepta email válido", () => {
    expect(validateEmail("user@email.com").valid).toBe(true)
    expect(validateEmail("user.name@domain.co").valid).toBe(true)
  })
})

describe("validatePassword", () => {
  it("rechaza password vacío", () => {
    expect(validatePassword("").valid).toBe(false)
  })

  it("rechaza password menor a 8 caracteres", () => {
    const result = validatePassword("Abc12")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Password must be 8-12 characters")
  })

  it("rechaza password mayor a 12 caracteres", () => {
    const result = validatePassword("Abcdef1234567")
    expect(result.valid).toBe(false)
  })

  it("rechaza password sin mayúscula", () => {
    const result = validatePassword("abc12345")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Must contain at least 1 uppercase letter")
  })

  it("rechaza password sin minúscula", () => {
    const result = validatePassword("ABC12345")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Must contain at least 1 lowercase letter")
  })

  it("rechaza password sin número", () => {
    const result = validatePassword("Abcdefgh")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Must contain at least 1 number")
  })

  it("acepta password válido", () => {
    expect(validatePassword("Abc12345").valid).toBe(true)
    expect(validatePassword("Password1").valid).toBe(true)
  })

  it("acepta password con caracteres especiales", () => {
    expect(validatePassword("Abc123!@#").valid).toBe(true)
  })
})

describe("validateConfirmPassword", () => {
  it("rechaza confirmación vacía", () => {
    const result = validateConfirmPassword("Abc12345", "")
    expect(result.valid).toBe(false)
  })

  it("rechaza contraseñas que no coinciden", () => {
    const result = validateConfirmPassword("Abc12345", "Abc12346")
    expect(result.valid).toBe(false)
    expect(result.error).toBe("Passwords do not match")
  })

  it("acepta contraseñas que coinciden", () => {
    const result = validateConfirmPassword("Abc12345", "Abc12345")
    expect(result.valid).toBe(true)
  })
})

describe("validateFirstName", () => {
  it("rechaza firstName vacío", () => {
    const result = validateFirstName("")
    expect(result.valid).toBe(false)
  })

  it("acepta firstName válido", () => {
    const result = validateFirstName("Juan")
    expect(result.valid).toBe(true)
  })

  it("acepta firstName con números (comportamiento real)", () => {
    const result = validateFirstName("Juan123")
    expect(result.valid).toBe(true)
  })
})

describe("validateLastName", () => {
  it("rechaza lastName vacío", () => {
    const result = validateLastName("")
    expect(result.valid).toBe(false)
  })

  it("acepta lastName válido", () => {
    const result = validateLastName("Pérez")
    expect(result.valid).toBe(true)
  })

  it("acepta lastName con números (comportamiento real)", () => {
    const result = validateLastName("Pérez123")
    expect(result.valid).toBe(true)
  })
})