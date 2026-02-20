"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { DashboardFilters } from "@/lib/queries";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 4 + i);
const MONTH_OPTIONS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

type FilterMode = "yearMonth" | "custom";

function isValidDateString(s: string): boolean {
  if (!s || s.length < 10) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export interface DashboardDateFiltersProps {
  value: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
  validationError: string | null;
  onValidationError: (message: string | null) => void;
}

export function DashboardDateFilters({
  value,
  onChange,
  validationError,
  onValidationError,
}: DashboardDateFiltersProps) {
  const hasCustomInValue = !!(value.date_from && value.date_to);
  const hasYearMonthInValue = value.year != null;

  const [mode, setMode] = useState<FilterMode>(() =>
    hasCustomInValue ? "custom" : "yearMonth"
  );
  const [year, setYear] = useState<string>(value.year?.toString() ?? "");
  const [month, setMonth] = useState<string>(value.month?.toString() ?? "");
  const [dateFrom, setDateFrom] = useState<string>(value.date_from ?? "");
  const [dateTo, setDateTo] = useState<string>(value.date_to ?? "");

  useEffect(() => {
    setYear(value.year?.toString() ?? "");
    setMonth(value.month?.toString() ?? "");
    setDateFrom(value.date_from ?? "");
    setDateTo(value.date_to ?? "");
  }, [value.year, value.month, value.date_from, value.date_to]);

  useEffect(() => {
    setMode(hasCustomInValue ? "custom" : "yearMonth");
  }, [hasCustomInValue]);

  const handleModeChange = (newMode: FilterMode) => {
    setMode(newMode);
    onValidationError(null);
    if (newMode === "custom") {
      setYear("");
      setMonth("");
    } else {
      setDateFrom("");
      setDateTo("");
    }
    onChange({});
  };

  const applyFilters = () => {
    onValidationError(null);

    if (mode === "custom") {
      if (!dateFrom.trim() || !dateTo.trim()) {
        onValidationError("Please select both From and To dates for custom range.");
        return;
      }
      if (!isValidDateString(dateFrom) || !isValidDateString(dateTo)) {
        onValidationError("Please enter valid dates in YYYY-MM-DD format.");
        return;
      }
      if (new Date(dateFrom) > new Date(dateTo)) {
        onValidationError("End date must be on or after start date.");
        return;
      }
      onChange({ date_from: dateFrom, date_to: dateTo });
      return;
    }

    if (year !== "") {
      const y = parseInt(year, 10);
      if (Number.isNaN(y)) {
        onValidationError("Please select a valid year.");
        return;
      }
      if (month !== "") {
        const m = parseInt(month, 10);
        if (Number.isNaN(m) || m < 1 || m > 12) {
          onValidationError("Please select a valid month.");
          return;
        }
        onChange({ year: y, month: m });
      } else {
        onChange({ year: y });
      }
    } else {
      onChange({});
    }
  };

  const clearFilters = () => {
    setYear("");
    setMonth("");
    setDateFrom("");
    setDateTo("");
    onValidationError(null);
    onChange({});
  };

  const hasAnyFilter =
    mode === "custom"
      ? dateFrom !== "" || dateTo !== ""
      : year !== "" || month !== "";

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Filter by</span>
          <RadioGroup
            value={mode}
            onValueChange={(v) => handleModeChange(v as FilterMode)}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yearMonth" id="filter-year-month" />
              <Label
                htmlFor="filter-year-month"
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                Year / Month
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="custom" id="filter-custom" />
              <Label
                htmlFor="filter-custom"
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                Custom range
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {mode === "yearMonth" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="dashboard-year" className="text-xs text-muted-foreground">
                Year
              </Label>
              <Select value={year || "all"} onValueChange={(v) => setYear(v === "all" ? "" : v)}>
                <SelectTrigger id="dashboard-year" className="w-[110px]">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {YEAR_OPTIONS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dashboard-month" className="text-xs text-muted-foreground">
                Month
              </Label>
              <Select value={month || "all"} onValueChange={(v) => setMonth(v === "all" ? "" : v)}>
                <SelectTrigger id="dashboard-month" className="w-[130px]">
                  <SelectValue placeholder="All months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All months</SelectItem>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {mode === "custom" && (
          <div className="flex items-end gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-invalid={!!validationError}
                className="w-[140px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-invalid={!!validationError}
                className="w-[140px]"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={applyFilters}
            className="gap-2 shrink-0"
            disabled={mode === "yearMonth" && month !== "" && year === ""}
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            Apply
          </Button>
          {hasAnyFilter && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={clearFilters}
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {validationError && (
        <div className="flex w-full items-center gap-2 rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
