import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { PasswordRequirements } from "./PasswordRequirements"
import { getPasswordRequirements } from "../utils/getPasswordRequirements"

describe("getPasswordRequirements", () => {
  it("todos los requisitos se cumplen con password válido", () => {
    const reqs = getPasswordRequirements("Abc12345", "Abc12345")
    expect(reqs.every((r) => r.met)).toBe(true)
  })

  it("passwords match solo cuando ambos coinciden", () => {
    const match = getPasswordRequirements("Abc12345", "Abc12345")
    expect(match[4].met).toBe(true)

    const noMatch = getPasswordRequirements("Abc12345", "Abc12346")
    expect(noMatch[4].met).toBe(false)
  })

  it("passwords match es false si alguno está vacío", () => {
    const empty = getPasswordRequirements("", "")
    expect(empty[4].met).toBe(false)
  })
})

describe("PasswordRequirements", () => {
  it("no renderiza cuando visible es false", () => {
    const { container } = render(
      <PasswordRequirements
        password=""
        confirmPassword=""
        visible={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it("renderiza todos los requisitos cuando visible es true", () => {
    render(
      <PasswordRequirements
        password=""
        confirmPassword=""
        visible
      />
    )

    expect(screen.getByText("8-12 characters")).toBeInTheDocument()
    expect(screen.getByText("At least 1 uppercase letter")).toBeInTheDocument()
    expect(screen.getByText("At least 1 lowercase letter")).toBeInTheDocument()
    expect(screen.getByText("At least 1 number")).toBeInTheDocument()
    expect(screen.getByText("Passwords match")).toBeInTheDocument()
  })
})
