// src/features/auth/components/PasswordInput.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { PasswordInput } from "./PasswordInput"

describe("PasswordInput", () => {
  it("renderiza el input de password", () => {
    render(<PasswordInput id="test" label="Password" />)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("togglea la visibilidad al hacer click", () => {
    render(<PasswordInput id="test" label="Password" />)
    const input = screen.getByLabelText("Password")
    const toggleButton = screen.getByRole("button")
    
    expect(input).toHaveAttribute("type", "password")
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute("type", "text")
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute("type", "password")
  })

  it("llama onBlur cuando el input pierde el foco", () => {
    const onBlur = vi.fn()
    render(<PasswordInput id="test" label="Password" onBlur={onBlur} />)
    fireEvent.blur(screen.getByLabelText("Password"))
    expect(onBlur).toHaveBeenCalled()
  })
})
